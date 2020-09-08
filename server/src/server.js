import '@babel/polyfill';
import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import H2o2 from '@hapi/h2o2';
import path from 'path';
import { features } from 'hermetic-common';
import editor from './editor';
import bunyanLoggingPlugin from './logging/bunyanLoggingPlugin';
import BunyanRequestLogger from './logging/BunyanRequestLogger';
import createLogger from './logging/createLogger';
import apiRoutes from './apiRoutes';
import reportingRoutes from './reportingRoutes';
import config from './config';
import auth from './auth';

if ((!config.auth.hasAuth)
  && ((config.baseYamlPath !== config.sampleDataPath)
    || (!!config.sandboxBasePath)
    || config.liveEditing)
  && (!config.auth.canRunWithNoAuth)) {
  // eslint-disable-next-line no-console
  console.error(`You are trying to start Hermetic without any authentication configured\n
If you are sure you want to do this, set the environment variable HERMETIC_RUN_WITH_NO_AUTH to 'Y'.\n
This is a VERY BAD IDEA if the system is accessible outside localhost.`);
  process.exit(1);
}

const plugins = [];

if (config.auth.hasAuth) {
  plugins.push(...auth.plugins);
}
if (config.debugClient) {
  plugins.push(H2o2);
}
plugins.push(Inert);


const baseLogger = createLogger();

plugins.push({
  plugin: bunyanLoggingPlugin,
  options: {
    baseLogger,
  },
});

const server = new Hapi.Server({
  port: config.port,
  routes: {
    // https://github.com/hapijs/hapi/issues/3658
    // "Changed validation errors to exclude all validation information.
    // Use failAction to expose the information needed"
    validate: {
      failAction: (request, h, err) => {
        baseLogger.warn(err, 'Invalid input');
        throw err;
      },
    },
    response: {
      failAction: (request, h, err) => {
        baseLogger.error(err, 'Invalid response');
        throw err;
      },
    },
  },
});

const routes = [];

let editRoutes = [];
if (config.sandboxBasePath) {
  editRoutes = editor.getRoutes();
}

const rawRoutes = apiRoutes.concat(reportingRoutes, editRoutes);
routes.push(...rawRoutes.map((r) => {
  const result = Object.assign({}, r);
  result.options = result.options || {};
  if (!r.feature) {
    throw new Error(`Route ${r.method} ${r.path} does not have a feature field and is insecure`);
  }
  auth.setRouteAclOption(result, r.feature);
  delete result.feature;
  const originalHandler = r.handler;
  result.handler = async (request, h) => {
    try {
      if (request.auth.credentials) {
        if (!(request.auth.credentials.scope
          && request.auth.credentials.scope.includes(features.edit))) {
          request.query.sandbox = null;
        }
      }
      const coreResult = await originalHandler(request, h);
      return coreResult;
    } catch (e) {
      baseLogger.error(e);
      throw e;
    }
  };
  return result;
}));

let staticHandler;

if (config.debugClient) {
  const proxyOptions = {
    host: 'localhost',
    port: 3000,
    protocol: 'http',
    passThrough: true,
  };
  staticHandler = (request, h) => h.proxy(proxyOptions);
} else {
  staticHandler = {
    directory: {
      path: config.staticContentRoot,
      redirectToSlash: true,
      index: true,
    },
  };
}

const staticRoute = {
  method: 'get',
  path: '/{param*}',
  handler: staticHandler,
};

routes.push(staticRoute);

const helpRoute = {
  method: 'get',
  path: '/help/{param*}',
  handler: {
    directory: {
      path: config.helpFilesPath,
      redirectToSlash: true,
      index: true,
    },
  },
};

routes.push(helpRoute);

server.ext('onRequest', (request, h) => {
  request.plugins.logger = new BunyanRequestLogger(baseLogger, request);
  return h.continue;
});

// handle bookmarked react router URLs
// which don't resolve to files on the server
server.ext('onPreResponse', (request, h) => {
  if (request.response && request.response.isBoom
    && request.response.output.statusCode === 404
    && request.route.path === staticRoute.path
    && request.route.method === staticRoute.method) {
    return h.file(
      path.resolve(config.staticContentRoot, 'index.html'),
      { confine: false },
    );
  }
  return h.continue;
});

const init = async () => {
  try {
    await server.register(plugins);

    if (config.auth.hasAuth) {
      auth.strategies.forEach(s => server.auth.strategy(s.name, s.scheme, s.settings));
    }

    await server.start();
    if (config.auth.hasAuth) {
      server.route(auth.authRoutes);
      server.auth.default('session');
    }
    server.route(routes);
    baseLogger.debug(`Listening on ${config.port}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw err;
  }
};

init();
