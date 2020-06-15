import Joi from 'joi';
import Boom from 'boom';
import { features } from 'hermetic-common';
import repository from './repository';
import config from './config';

const query = {
  sandbox: Joi.string().optional().alphanum(),
};

const routes = [
  {
    path: '/api/capabilityType',
    method: 'GET',
    feature: features.core,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getCapabilityTypes(request.query.sandbox),
  },
  {
    path: '/api/capability/{capabilityId}',
    method: 'GET',
    feature: features.core,
    options: {
      validate: {
        params: {
          capabilityId: Joi.string().required(),
        },
        query,
      },
    },
    handler: async (request) => {
      const data = await repository
        .getCapabilityDetail(request.query.sandbox, request.params.capabilityId);
      if (data) {
        return data;
      }
      return Boom.notFound(`Capability not found: ${request.params.capabilityId}`);
    },
  },
  {
    path: '/api/capability/{capabilityId}/health',
    method: 'GET',
    feature: features.capabilityHealthMetrics,
    options: {
      validate: {
        params: {
          capabilityId: Joi.string().required(),
        },
        query,
      },
    },
    handler: async (request) => {
      const data = await repository.getCapabilityHealth(request.query.sandbox,
        request.params.capabilityId);
      if (data) {
        return data;
      }
      return Boom.notFound(`Capability not found: ${request.params.capabilityId}`);
    },
  },
  {
    path: '/api/technology',
    method: 'GET',
    feature: features.core,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getTechnologies(request.query.sandbox,
      request.auth.credentials),
  },
  {
    path: '/api/technologyCategory',
    method: 'GET',
    feature: features.core,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getTechnologyCategories(request.query.sandbox),
  },
  {
    path: '/api/vendor',
    method: 'GET',
    feature: features.core,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getVendors(request.query.sandbox),
  },
  {
    path: '/api/vendor/{vendorId}',
    method: 'GET',
    feature: features.core,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getVendorDetail(request.query.sandbox,
      request.params.vendorId,
      request.auth.credentials),
  },
  {
    path: '/api/technologyHealthMetrics/totals',
    method: 'GET',
    feature: features.technologyHealthMetrics,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository
      .getTechnologyHealthMetricTotals(request.query.sandbox,
        request.auth.credentials),
  },
  {
    path: '/api/technologyHealthMetrics/bands',
    method: 'GET',
    feature: features.technologyHealthMetrics,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getTechnologyHealthMetricBands(request.query.sandbox),
  },
  {
    path: '/api/capabilityHealthMetrics/totals',
    method: 'GET',
    feature: features.capabilityHealthMetrics,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getCapabilityHealthMetricTotals(request.query.sandbox),
  },
  {
    path: '/api/capabilityHealthMetrics/bands',
    method: 'GET',
    feature: features.capabilityHealthMetrics,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getCapabilityHealthMetricBands(request.query.sandbox),
  },
  {
    path: '/api/capabilityResourcing',
    method: 'GET',
    feature: features.capabilityResourcing,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getCapabilityResourcing(request.query.sandbox),
  },
  {
    path: '/api/technology/{technologyId}',
    method: 'GET',
    feature: features.core,
    options: {
      validate: {
        params: {
          technologyId: Joi.string().required(),
        },
        query,
      },
    },
    handler: async (request) => {
      const data = await repository
        .getTechnologyDetail(request.query.sandbox,
          request.params.technologyId, request.params.credentials);
      if (data) {
        return data;
      }
      return Boom.notFound(`Technology not found: ${request.params.technologyId}`);
    },
  },
  {
    path: '/api/technology/{technologyId}/technical',
    method: 'GET',
    feature: features.techDetails,
    options: {
      validate: {
        params: {
          technologyId: Joi.string().required(),
        },
        query,
      },
    },
    handler: async (request) => {
      const data = await repository.getTechnologyTechDetail(request.query.sandbox,
        request.params.technologyId);
      if (data) {
        return data;
      }
      return Boom.notFound(`Technology not found: ${request.params.technologyId}`);
    },
  },
  {
    path: '/api/technology/{technologyId}/components',
    method: 'GET',
    feature: features.techDetails,
    options: {
      validate: {
        params: {
          technologyId: Joi.string().required(),
        },
        query,
      },
    },
    handler: async (request) => {
      const data = await repository.getTechnologyComponents(request.query.sandbox,
        request.params.technologyId);
      if (data) {
        return data;
      }
      return Boom.notFound(`Technology not found: ${request.params.technologyId}`);
    },
  },
  {
    path: '/api/technology/{technologyId}/deployment',
    method: 'GET',
    feature: features.techDetails,
    options: {
      validate: {
        params: {
          technologyId: Joi.string().required(),
        },
        query,
      },
    },
    handler: async (request) => {
      const data = await repository.getTechnologyComponentDeployment(request.query.sandbox,
        request.params.technologyId);
      if (data) {
        return data;
      }
      return Boom.notFound(`Technology not found: ${request.params.technologyId}`);
    },
  },
  {
    path: '/api/technology/{technologyId}/health',
    method: 'GET',
    feature: features.technologyHealthMetrics,
    options: {
      validate: {
        params: {
          technologyId: Joi.string().required(),
        },
        query,
      },
    },
    handler: async (request) => {
      const data = await repository
        .getTechnologyHealth(request.query.sandbox,
          request.params.technologyId, request.auth.credentials);
      if (data) {
        return data;
      }
      return Boom.notFound(`Technology not found: ${request.params.technologyId}`);
    },
  },
  {
    path: '/api/node',
    method: 'GET',
    feature: features.techDetails,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getNodes(request.query.sandbox),
  },
  {
    path: '/api/node/{nodeId}',
    method: 'GET',
    feature: features.techDetails,
    options: {
      validate: {
        params: {
          nodeId: Joi.string().required(),
        },
        query,
      },
    },
    handler: async (request) => {
      const data = repository.getNode(request.query.sandbox, request.params.nodeId);
      if (data) {
        return data;
      }
      return Boom.notFound(`Node not found: ${request.params.nodeId}`);
    },
  },
  {
    path: '/api/technicalReferenceModel',
    method: 'GET',
    feature: features.techDetails,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getTechnicalReferenceModel(request.query.sandbox),
  },
  {
    path: '/api/technicalStandardAssessments',
    method: 'GET',
    feature: features.techDetails,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getTechnicalStandardAssessments(request.query.sandbox),
  },
  {
    path: '/api/businessUnit',
    method: 'GET',
    feature: features.core,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getBusinessUnits(request.query.sandbox),
  },
  {
    path: '/api/businessUnit/{businessUnitId}',
    method: 'GET',
    feature: features.core,
    options: {
      validate: {
        params: {
          businessUnitId: Joi.string().required(),
        },
        query,
      },
    },
    handler: async (request) => {
      const data = await repository.getBusinessUnitDetail(request.query.sandbox,
        request.params.businessUnitId);
      if (data) {
        return data;
      }
      return Boom.notFound(`Business unit not found: ${request.params.businessUnitId}`);
    },
  },
  {
    path: '/api/dataTopic',
    method: 'GET',
    feature: features.core,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getDataTopics(request.query.sandbox),
  },
  {
    path: '/api/dataTopicType',
    method: 'GET',
    feature: features.core,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getDataTopicTypes(request.query.sandbox),
  },
  {
    path: '/api/dataEntity',
    method: 'GET',
    feature: features.core,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getDataEntities(request.query.sandbox),
  },
  {
    path: '/api/dataEntity/{dataEntityId}',
    method: 'GET',
    feature: features.core,
    options: {
      validate: {
        params: {
          dataEntityId: Joi.string().required(),
        },
        query,
      },
    },
    handler: async (request) => {
      const data = await repository.getDataEntity(request.query.sandbox,
        request.params.dataEntityId);
      if (data) {
        return data;
      }
      return Boom.notFound(`Data entity not found: ${request.params.dataEntityId}`);
    },
  },
  {
    path: '/api/appReferenceModelDomainGroup',
    method: 'GET',
    feature: features.core,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getAppRefModelDomainGroups(request.query.sandbox),
  },
  {
    path: '/api/appReferenceModelDomain',
    method: 'GET',
    feature: features.core,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getAppRefModelDomains(request.query.sandbox),
  },
  {
    path: '/api/appReferenceModelTechnology',
    method: 'GET',
    feature: features.core,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getAppRefModelTechnologies(request.query.sandbox,
      request.auth.credentials),
  },
  {
    path: '/api/eaDomain',
    method: 'GET',
    feature: features.core,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getEaDomains(request.query.sandbox),
  },
  {
    path: '/api/eaArtifact/{eaArtifactId}',
    method: 'GET',
    feature: features.core,
    options: {
      validate: {
        params: {
          eaArtifactId: Joi.string().required(),
        },
        query,
      },
    },
    handler: async (request) => {
      const data = await repository.getEaArtifact(request.query.sandbox,
        request.params.eaArtifactId);
      if (data) {
        return data;
      }
      return Boom.notFound(`EA Artifact not found: ${request.params.eaArtifactId}`);
    },
  },
  {
    path: '/api/eaArtifact/{eaArtifactId}/health',
    method: 'GET',
    feature: features.eaHealthMetrics,
    options: {
      validate: {
        params: {
          eaArtifactId: Joi.string().required(),
        },
        query,
      },
    },
    handler: async (request) => {
      const data = await repository.getEaArtifactHealth(request.query.sandbox,
        request.params.eaArtifactId);
      if (data) {
        return data;
      }
      return Boom.notFound(`EA Artifact not found: ${request.params.eaArtifactId}`);
    },
  },
  {
    path: '/api/eaArtifactMetrics/totals',
    method: 'GET',
    feature: features.eaHealthMetrics,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getEaArtifactMetricTotals(request.query.sandbox),
  },
  {
    path: '/api/eaArtifactMetrics/bands',
    method: 'GET',
    feature: features.eaHealthMetrics,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository.getEaArtifactMetricBands(request.query.sandbox),
  },
  {
    path: '/api/functionalCapability',
    method: 'GET',
    feature: features.techDetails,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository
      .getFunctionalCapabilities(request.query.sandbox),
  },
  {
    path: '/api/functionalCapability/{functionalCapabilityId}',
    method: 'GET',
    feature: features.techDetails,
    options: {
      validate: {
        params: {
          functionalCapabilityId: Joi.string().required(),
        },
        query,
      },
    },
    handler: async (request) => {
      const data = await repository
        .getFunctionalCapability(request.query.sandbox,
          request.params.functionalCapabilityId);
      if (data) {
        return data;
      }
      return Boom.notFound(`Functional capability not found: ${request.params.functionalCapabilityId}`);
    },
  },
  {
    path: '/api/technologyCost',
    method: 'GET',
    feature: features.cost,
    options: {
      validate: {
        query,
      },
    },
    handler: request => repository
      .getTechnologyCosts(request.query.sandbox),
  },
  {
    path: '/api/accessRights',
    method: 'GET',
    feature: features.core,
    options: {
      validate: {
        query,
      },
    },
    handler: async (request) => {
      if (!request.auth.credentials) {
        // if authentication is not configured by a custom plugin
        // everyone can do everything that is possible
        return {
          allowedFeatures: Object.getOwnPropertyNames(features)
            .filter(key => (key !== 'edit') || config.sandboxBasePath)
            .map(key => features[key]),
        };
      }
      return {
        displayName: request.auth.credentials.displayName,
        username: request.auth.credentials.username,
        allowedFeatures: request.auth.credentials.scope,
      };
    },
  },
];

export default routes;
