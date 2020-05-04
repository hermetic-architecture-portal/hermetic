import { features, schema } from 'hermetic-common';
import cache from './cache';
import auth from './auth';
import config from './config';

const routes = Object.getOwnPropertyNames(schema.describe().children)
  .filter(fieldName => fieldName !== 'technologyCosts')
  .map(fieldName => ({
    method: 'get',
    path: `/api/reporting/${fieldName}`,
    options: {
      auth: config.auth.hasAuth && {
        strategy: 'reporting',
      },
      description: fieldName,
      notes: schema.describe().children[fieldName].description,
    },
    feature: features.reporting,
    handler: async () => {
      const data = await cache();
      return data[fieldName];
    },
  }));

const infoRoute = {
  method: 'get',
  path: '/api/reporting',
  feature: features.reporting,
  handler: async (request) => {
    const token = await auth.getReportingToken(request);
    return {
      token: config.auth.hasAuth && token,
      tokenExpiryHours: config.auth.reportingTokenExpiryHours,
      routes: routes.map(r => ({
        path: r.path,
        name: r.options.description,
        description: r.options.notes,
      })),
    };
  },
};

export default [...routes, infoRoute];
