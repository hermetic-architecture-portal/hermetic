import plugin from 'hermetic-client-plugin';
import config from './config';
import fetchHelper from './fetchHelper';

const api = {
  getCapabilityTypes: async () => api.fetchJson(`${config.apiBaseUrl}/capabilityType`),
  getAccessRights: async () => api.fetchJson(`${config.apiBaseUrl}/accessRights`),
  getTechnologies: async () => api.fetchJson(`${config.apiBaseUrl}/technology`),
  getTechnologyHealthMetricTotals: async () => api.fetchJson(`${config.apiBaseUrl}/technologyHealthMetrics/totals`),
  getTechnologyHealthMetricBands: async () => api.fetchJson(`${config.apiBaseUrl}/technologyHealthMetrics/bands`),
  getCapabilityHealthMetricTotals: async () => api.fetchJson(`${config.apiBaseUrl}/capabilityHealthMetrics/totals`),
  getCapabilityHealthMetricBands: async () => api.fetchJson(`${config.apiBaseUrl}/capabilityHealthMetrics/bands`),
  getCapabilityResourcing: async () => api.fetchJson(`${config.apiBaseUrl}/capabilityResourcing`),
  getTechnologyDetail: async technologyId => api
    .fetchJson(`${config.apiBaseUrl}/technology/${encodeURIComponent(technologyId)}`),
  getCapabilityDetail: async capabilityId => api
    .fetchJson(`${config.apiBaseUrl}/capability/${encodeURIComponent(capabilityId)}`),
  getCapabilityHealthDetail: async capabilityId => api
    .fetchJson(`${config.apiBaseUrl}/capability/${encodeURIComponent(capabilityId)}/health`),
  getTechnologyTechDetail: async technologyId => api
    .fetchJson(`${config.apiBaseUrl}/technology/${encodeURIComponent(technologyId)}/technical`),
  getTechnologyComponents: async technologyId => api
    .fetchJson(`${config.apiBaseUrl}/technology/${encodeURIComponent(technologyId)}/components`),
  getTechnologyComponentDeployments: async technologyId => api
    .fetchJson(`${config.apiBaseUrl}/technology/${encodeURIComponent(technologyId)}/deployment`),
  getTechnologyHealthDetail: async technologyId => api
    .fetchJson(`${config.apiBaseUrl}/technology/${encodeURIComponent(technologyId)}/health`),
  getNodes: async () => api.fetchJson(`${config.apiBaseUrl}/node`),
  getNode: async nodeId => api
    .fetchJson(`${config.apiBaseUrl}/node/${encodeURIComponent(nodeId)}`),
  getTechnicalReferenceModel: async () => api.fetchJson(`${config.apiBaseUrl}/technicalReferenceModel`),
  getTechnicalStandardAssessments: async () => api.fetchJson(`${config.apiBaseUrl}/technicalStandardAssessments`),
  getBusinessUnits: async () => api.fetchJson(`${config.apiBaseUrl}/businessUnit`),
  getBusinessUnitDetail: async businessUnitId => api.fetchJson(`${config.apiBaseUrl}/businessUnit/${businessUnitId}`),
  getDataTopics: async () => api.fetchJson(`${config.apiBaseUrl}/dataTopic`),
  getDataTopicTypes: async () => api.fetchJson(`${config.apiBaseUrl}/dataTopicType`),
  getDataEntities: async () => api.fetchJson(`${config.apiBaseUrl}/dataEntity`),
  getDataEntityDetail: async dataEntityId => api.fetchJson(`${config.apiBaseUrl}/dataEntity/${dataEntityId}`),
  getEaDomains: async () => api.fetchJson(`${config.apiBaseUrl}/eaDomain`),
  getEaArtifactDetail: async eaArtifactId => api.fetchJson(`${config.apiBaseUrl}/eaArtifact/${eaArtifactId}`),
  getEaArtifactHealthDetail: async eaArtifactId => api.fetchJson(`${config.apiBaseUrl}/eaArtifact/${eaArtifactId}/health`),
  getEaArtifactHealthMetricTotals: async () => api.fetchJson(`${config.apiBaseUrl}/eaArtifactMetrics/totals`),
  getEaArtifactHealthMetricBands: async () => api.fetchJson(`${config.apiBaseUrl}/eaArtifactMetrics/bands`),
  getFunctionalCapabilities: async () => api.fetchJson(`${config.apiBaseUrl}/functionalCapability`),
  getFunctionalCapabilityDetail: async functionalCapabilityId => api.fetchJson(`${config.apiBaseUrl}/functionalCapability/${functionalCapabilityId}`),
  getSandboxes: async () => api.fetchJson(`${config.apiBaseUrl}/edit/sandbox`),

  sandbox: null,

  fetchJson: async (url, options) => {
    let newUrl = url;
    if (api.sandbox) {
      if (newUrl.includes('?')) {
        newUrl = `${newUrl}&sandbox=${api.sandbox}`;
      } else {
        newUrl = `${newUrl}?sandbox=${api.sandbox}`;
      }
    }
    const defaults = {
      headers: {},
    };
    const newOptions = Object.assign(defaults, options);
    if (plugin.getAuthToken) {
      let token;
      try {
        token = await plugin.getAuthToken();
      } catch (e) {
        // eslint-disable-next-line no-alert
        alert(`Error getting token: ${e.message}`);
        throw e;
      }
      Object.assign(newOptions.headers, {
        Authorization: `Bearer ${token}`,
      });
    }
    return fetchHelper(newUrl, newOptions);
  },
};

export default api;
