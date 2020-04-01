import Bell from '@hapi/bell';
import Cookie from '@hapi/cookie';
import Iron from '@hapi/iron';
import AuthBearer from 'hapi-auth-bearer-token';
import { features } from 'hermetic-common';
import config from './config';

const traverse = (profile, path) => {
  // given a path like 'id', or 'raw.upn'
  // traverse the profile to pull up the relevant field
  const splitPath = path.split('.');
  let current = profile;
  for (let i = 0; i < splitPath.length - 1; i += 1) {
    current = current[splitPath[i]];
  }
  return current[splitPath[splitPath.length - 1]];
};

// human friendly username could be in various parts of the token
// depending on the provider
const getUsername = profile => traverse(profile, config.auth.idField);

// likewise user roles/groups
const getRoles = (profile) => {
  // maybe this returns an array for some providers? Anyway it's
  // a string representation of an array for Azure
  let roles = traverse(profile, config.auth.rolesField) || [];
  if ((typeof roles === 'string') && roles.startsWith('[') && roles.endsWith(']')) {
    roles = JSON.parse(roles);
  }
  return roles;
};

const getAllowedFeatures = (roles) => {
  // can only have 'edit' feature if sandboxes are configured
  const possibleFeatures = Object.getOwnPropertyNames(features)
    .filter(key => (features[key] !== features.edit) || config.sandboxBasePath);

  if (!config.auth.roleBasedAcls) {
    return possibleFeatures.map(key => features[key]);
  }
  return possibleFeatures.filter(key => (config.auth.rolesForFeatures[key] || [])
    .some(role => roles.includes(role)));
};

const setRouteAclOption = (route, requiredFeature) => {
  if (!config.auth.hasAuth) {
    return;
  }
  // eslint-disable-next-line no-param-reassign
  route.options.auth = route.options.auth || {};
  // eslint-disable-next-line no-param-reassign
  route.options.auth.access = {
    scope: requiredFeature,
  };
};

const ironOptions = Object.assign({}, Iron.defaults);
ironOptions.ttl = Math.floor(config.auth.reportingTokenExpiryHours * 60 * 60 * 1000);

const auth = {
  plugins: [Bell, Cookie, AuthBearer],
  authRoutes: [
    {
      path: '/callback',
      method: ['GET', 'POST'],
      options: {
        auth: 'oauth2',
        plugins: {
          'hapi-auth-cookie': {
            redirectTo: false,
          },
        },
      },
      handler: (request, h) => {
        const roles = getRoles(request.auth.credentials.profile);
        const identity = {
          displayName: request.auth.credentials.profile.displayName,
          username: getUsername(request.auth.credentials.profile),
          roles,
          scope: getAllowedFeatures(roles),
        };
        request.cookieAuth.set(identity);
        return h.redirect('/');
      },
    },
    {
      path: '/logout',
      method: 'GET',
      options: {
        handler: (request, h) => {
          request.cookieAuth.clear();
          return h.redirect(
            config.auth.providerLogoutUrl,
          );
        },
      },
    },

  ],
  getReportingToken: (request) => {
    const identity = {
      username: request.auth.username,
      scope: [features.reporting],
    };
    return Iron.seal(identity, config.auth.cookieSecret, ironOptions);
  },
  strategies: [
    {
      name: 'session',
      scheme: 'cookie',
      settings: {
        cookie: {
          name: 'hermetic-session',
          password: config.auth.cookieSecret,
          isSecure: !config.auth.insecureCookies,
          // session cookies would be dangerous as they could be replayed indefinitely
          ttl: 60 * 60 * 1000, // 1hr expiry time
        },
        redirectTo: '/callback',
      },
    },
    {
      name: 'oauth2',
      scheme: 'bell',
      settings: {
        provider: config.auth.provider,
        password: config.auth.cookieSecret,
        clientId: config.auth.clientId,
        clientSecret: config.auth.clientSecret,
        isSecure: !config.auth.insecureCookies,
        // bell does not detect https from x-forwarded headers
        // so secure cookies will not work behind
        // a reverse proxy without forceHttps
        forceHttps: !config.auth.insecureCookies,
        config: config.auth.providerConfig,
      },
    },
    {
      name: 'reporting',
      scheme: 'bearer-access-token',
      settings: {
        validate: async (request, token) => {
          try {
            const unsealed = await Iron.unseal(token, config.auth.cookieSecret, ironOptions);
            return {
              isValid: true,
              credentials: unsealed,
            };
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Error unsealing token', e);
            return {
              isValid: false,
            };
          }
        },
      },
    },
  ],

  setRouteAclOption,
};

export default auth;
