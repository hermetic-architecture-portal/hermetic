import '@babel/polyfill';
import Hapi from 'hapi';
import Inert from 'inert';
import path from 'path';
import plugin from 'hermetic-server-plugin';
import editPlugin from 'hermetic-edit-server-plugin';
import { features, schema } from 'hermetic-common';
import bunyanLoggingPlugin from './logging/bunyanLoggingPlugin';
import BunyanRequestLogger from './logging/BunyanRequestLogger';
import createLogger from './logging/createLogger';
import apiRoutes from './apiRoutes';
import reportingRoutes from './reportingRoutes';
import config from './config';
import cache from './cache';

// eslint-disable-next-line no-console
console.log(`Loaded plugin "${plugin.pluginName}"`);

if ((!(plugin.hapiAuthStrategies && plugin.hapiAuthStrategies.length))
  && (config.baseYamlPath !== config.sampleDataPath)
  && (!config.canRunWithNoAuth)) {
  // eslint-disable-next-line no-console
  console.error(`You are trying to start Hermetic without any authentication configured
  if you are sure you want to do this, set the HERMETIC_RUN_WITH_NO_AUTH to 'Y'`);
  process.exit(1);
}

const plugins = [];

plugins.push(Inert);
if (plugin.hapiPlugins) {
  plugins.push(...plugin.hapiPlugins);
}

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
    cors: {
      origin: [config.corsOrigin],
    },
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
if (editPlugin.getRoutes) {
  // eslint-disable-next-line no-console
  console.log('Loaded Edit plugin');
  editRoutes = editPlugin.getRoutes(schema, cache, features);
}
const rawRoutes = apiRoutes.concat(reportingRoutes, editRoutes);
routes.push(...rawRoutes.map((r) => {
  const result = Object.assign({}, r);
  result.options = result.options || {};

  if (plugin.hapiAuthStrategies) {
    result.options.auth = {
      strategies: plugin.hapiAuthStrategies.map(s => s.name),
    };
  }
  const originalHandler = r.handler;
  result.handler = async (request, h) => {
    try {
      if (request.auth.credentials) {
        if (!(request.auth.credentials.allowedFeatures
          && request.auth.credentials.allowedFeatures.includes(features.edit))) {
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

const staticRoute = {
  method: 'get',
  path: '/{param*}',
  handler: {
    directory: {
      path: config.staticContentRoot,
      redirectToSlash: true,
      index: true,
    },
  },
};

routes.push(staticRoute);

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

    if (plugin.hapiAuthStrategies) {
      plugin.hapiAuthStrategies.forEach(s => server
        .auth.strategy(s.name, s.scheme, s.options));
    }

    await server.start();
    server.route(routes);
    baseLogger.debug(`Listening on ${config.port}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw err;
  }
};

init();
