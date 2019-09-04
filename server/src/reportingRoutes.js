import { features, schema } from 'hermetic-common';
import cache from './cache';

const routes = Object.getOwnPropertyNames(schema.describe().children)
  .map(fieldName => ({
    method: 'get',
    path: `/api/reporting/${fieldName}`,
    options: {
      plugins: {
        feature: features.reporting,
      },
    },
    handler: async () => {
      const data = await cache();
      return data[fieldName];
    },
  }));

export default routes;
