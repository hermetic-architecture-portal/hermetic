import { schema, features } from 'hermetic-common';
import Joi from 'joi';
import buildCRUDRoutes from './buildCRUDRoutes';
import sandboxHandlers from './sandboxHandlers';
import saveData from './saveData';
import config from '../config';
import cache from '../cache';

const sandboxRoutes = [
  {
    path: '/api/edit/sandbox/{sandbox}',
    method: 'POST',
    options: {
      validate: {
        params: {
          // !!!!!!!!!!!!!!!!!!!!!!!!
          // restricting this to alphanumeric
          // to prevent attempts to break out from sandbox directory
          sandbox: Joi.string().required()
            .alphanum(),
        },
      },
    },
    handler: async request => sandboxHandlers
      .createSandbox(request.params.sandbox, request.plugins.logger),
  },
  {
    path: '/api/edit/sandbox/{sandbox}',
    method: 'DELETE',
    options: {
      validate: {
        params: {
          sandbox: Joi.string().required()
            .alphanum(),
        },
      },
    },
    handler: async request => sandboxHandlers
      .deleteSandbox(request.params.sandbox, request.plugins.logger),
  },
  {
    path: '/api/edit/sandbox/{sandbox}/publish',
    method: 'POST',
    options: {
      validate: {
        params: {
          sandbox: Joi.string().required()
            .alphanum(),
        },
        payload: Joi.object({
          comment: Joi.string().min(1).required(),
        }),
      },
    },
    handler: async request => sandboxHandlers
      .publishSandbox(request.params.sandbox, request.payload.comment,
        request.auth && request.auth.credentials, request.plugins.logger),
  },
  {
    path: '/api/edit/sandbox',
    method: 'GET',
    handler: async () => sandboxHandlers
      .getSandboxes(),
  },
  {
    path: '/api/edit/editingMode',
    method: 'GET',
    handler: () => ({
      liveEditing: config.liveEditing,
    }),
  },
];

const getRoutes = () => {
  if ((!config.liveEditing) && (!config.sandboxBasePath)) {
    // eslint-disable-next-line max-len
    throw new Error('The sandbox path configuration setting (HERMETIC_SANDBOX_PATH) must be supplied to enable editing functionality');
  }
  const crudRoutes = buildCRUDRoutes(schema, '/api/edit', cache, saveData, config.editorPageSize);
  const combined = crudRoutes.concat(sandboxRoutes);
  // apply security
  combined.forEach((route) => {
    // eslint-disable-next-line no-param-reassign
    route.options = route.options || {};
    // eslint-disable-next-line no-param-reassign
    route.feature = features.edit;
  });
  return combined;
};

export default getRoutes;
