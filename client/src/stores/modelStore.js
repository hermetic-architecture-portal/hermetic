import { observable } from 'mobx';
import api from '../api';

const modelStore = {
  capabilityTypes: observable([]),
  capabilityDetails: observable([]),
  technologies: observable([]),
  technologyDetails: observable([]),
  technologyTechDetails: observable([]),
  technologyComponents: observable([]),
  technologyComponentDeployments: observable([]),
  technologyHealthDetails: observable([]),
  technologyHealthMetricTotals: observable([]),
  technologyHealthMetricTotalBands: observable([]),
  capabilityHealthMetricTotals: observable([]),
  capabilityHealthMetricTotalBands: observable([]),
  capabilityHealthDetails: observable([]),
  capabilityResourcing: observable([]),
  dataConnections: observable([]),
  nodes: observable([]),
  nodeDetails: observable([]),
  techRefModelLayers: observable([]),
  techRefModelCategories: observable([]),
  businessUnits: observable([]),
  businessUnitDetails: observable([]),
  technicalStandardLevels: observable([]),
  technicalStandardAssessments: observable([]),
  dataTopicTypes: observable([]),
  dataTopics: observable([]),
  dataEntities: observable([]),
  dataEntityDetails: observable([]),
  eaDomains: observable([]),
  eaArtifactDetails: observable([]),
  eaMetricTotals: observable([]),
  eaMetricTotalBands: observable([]),
  eaArtifactHealthDetails: observable([]),

  reset: () => Object.getOwnPropertyNames(modelStore)
    .filter(fieldName => modelStore[fieldName] && modelStore[fieldName].clear)
    .forEach(fieldName => modelStore[fieldName].clear()),

  loadNodes: async () => {
    if (modelStore.nodes.length) {
      return;
    }
    const nodesData = await api.getNodes();
    modelStore.nodes.replace(nodesData);
  },

  loadNodeDetail: async (nodeId) => {
    if (modelStore.nodeDetails.some(node => node.nodeId === nodeId)) {
      return;
    }
    const nodeData = await api.getNode(nodeId);
    modelStore.nodeDetails.push(nodeData);
  },

  loadCapabilityTypes: async () => {
    if (modelStore.capabilityTypes.length) {
      return;
    }
    const capabilityTypesData = await api.getCapabilityTypes();
    modelStore.capabilityTypes.replace(capabilityTypesData);
  },

  loadTechnologies: async () => {
    if (modelStore.technologies.length) {
      return;
    }
    const data = await api.getTechnologies();
    modelStore.technologies.replace(data.technologies);
    modelStore.dataConnections.replace(data.connections);
  },

  loadTechnologyHealthMetricTotals: async () => {
    if (modelStore.technologyHealthMetricTotals.length) {
      return;
    }
    const [health, bands] = await Promise.all([
      api.getTechnologyHealthMetricTotals(),
      api.getTechnologyHealthMetricBands(),
    ]);
    modelStore.technologyHealthMetricTotals.replace(health);
    modelStore.technologyHealthMetricTotalBands.replace(bands);
  },

  loadCapabilityResourcing: async () => {
    if (modelStore.capabilityResourcing.length) {
      return;
    }
    const result = await api.getCapabilityResourcing();
    modelStore.capabilityResourcing.replace(result);
  },

  loadCapabilityHealthMetricTotals: async () => {
    if (modelStore.capabilityHealthMetricTotals.length) {
      return;
    }
    const [health, bands] = await Promise.all([
      api.getCapabilityHealthMetricTotals(),
      api.getCapabilityHealthMetricBands(),
    ]);
    modelStore.capabilityHealthMetricTotals.replace(health);
    modelStore.capabilityHealthMetricTotalBands.replace(bands);
  },

  loadTechnologyDetail: async (technologyId) => {
    if (modelStore.technologyDetails.some(tech => tech.technologyId === technologyId)) {
      return;
    }
    const data = await api.getTechnologyDetail(technologyId);
    modelStore.technologyDetails.push(data);
  },

  loadTechnologyTechDetail: async (technologyId) => {
    if (modelStore.technologyTechDetails.some(tech => tech.technologyId === technologyId)) {
      return;
    }
    const data = await api.getTechnologyTechDetail(technologyId);
    modelStore.technologyTechDetails.push(data);
  },

  loadTechnologyComponents: async (technologyId) => {
    if (modelStore.technologyComponents.find(tech => tech.technologyId === technologyId)) {
      return;
    }
    const data = await api.getTechnologyComponents(technologyId);

    modelStore.technologyComponents.push({
      technologyId,
      components: data.components,
      connections: data.connections,
    });
  },

  loadTechnologyDeployment: async (technologyId) => {
    if (modelStore.technologyComponentDeployments
      .find(tech => tech.technologyId === technologyId)) {
      return;
    }
    const data = await api.getTechnologyComponentDeployments(technologyId);

    modelStore.technologyComponentDeployments.push({
      technologyId,
      deployments: data,
    });
  },

  loadTechnologyHealthDetail: async (technologyId) => {
    if (modelStore.technologyHealthDetails.some(tech => tech.technologyId === technologyId)) {
      return;
    }
    const data = await api.getTechnologyHealthDetail(technologyId);
    modelStore.technologyHealthDetails.push(data);
  },

  loadCapabilityDetail: async (capabilityId) => {
    if (modelStore.capabilityDetails.some(cap => cap.capabilityId === capabilityId)) {
      return;
    }
    const detailData = await api.getCapabilityDetail(capabilityId);
    modelStore.capabilityDetails.push(detailData);
  },

  loadCapabilityHealthDetail: async (capabilityId) => {
    if (modelStore.capabilityHealthDetails.some(cap => cap.capabilityId === capabilityId)) {
      return;
    }
    const detailData = await api.getCapabilityHealthDetail(capabilityId);
    modelStore.capabilityHealthDetails.push(detailData);
  },

  loadTechRefModel: async () => {
    if (modelStore.techRefModelLayers.length) {
      return;
    }
    const refModel = await api.getTechnicalReferenceModel();

    modelStore.techRefModelCategories.replace(refModel.categories);
    modelStore.techRefModelLayers.replace(refModel.layers);
  },

  loadTechnicalStandardAssessments: async () => {
    if (modelStore.technicalStandardAssessments.length) {
      return;
    }
    const data = await api.getTechnicalStandardAssessments();

    modelStore.technicalStandardAssessments.replace(data.technologies);
    modelStore.technicalStandardLevels.replace(data.technicalStandardLevels);
  },

  loadBusinessUnits: async () => {
    if (modelStore.businessUnits.length) {
      return;
    }
    const data = await api.getBusinessUnits();
    modelStore.businessUnits.replace(data);
  },

  loadBusinessUnitDetail: async (businessUnitId) => {
    if (modelStore.businessUnitDetails.some(bu => bu.businessUnitId === businessUnitId)) {
      return;
    }
    const data = await api.getBusinessUnitDetail(businessUnitId);
    modelStore.businessUnitDetails.push(data);
  },

  loadDataEntities: async () => {
    if (modelStore.dataEntities.length) {
      return;
    }
    const entities = await api.getDataEntities();
    const dataTopics = await api.getDataTopics();
    const dataTopicTypes = await api.getDataTopicTypes();
    modelStore.dataEntities.replace(entities);
    modelStore.dataTopics.replace(dataTopics);
    modelStore.dataTopicTypes.replace(dataTopicTypes);
  },

  loadDataEntityDetail: async (dataEntityId) => {
    if (modelStore.dataEntityDetails.some(de => de.dataEntityId === dataEntityId)) {
      return;
    }
    const data = await api.getDataEntityDetail(dataEntityId);
    modelStore.dataEntityDetails.push(data);
  },

  loadEaDomains: async () => {
    if (modelStore.eaDomains.length) {
      return;
    }
    const data = await api.getEaDomains();
    modelStore.eaDomains.replace(data);
  },

  loadEaArtifactDetail: async (eaArtifactId) => {
    if (modelStore.eaArtifactDetails.some(a => a.eaArtifactId === eaArtifactId)) {
      return;
    }
    const data = await api.getEaArtifactDetail(eaArtifactId);
    modelStore.eaArtifactDetails.push(data);
  },

  loadEaMetricTotals: async () => {
    if (modelStore.eaMetricTotals.length) {
      return;
    }
    const [health, bands] = await Promise.all([
      api.getEaArtifactHealthMetricTotals(),
      api.getEaArtifactHealthMetricBands(),
    ]);
    modelStore.eaMetricTotals.replace(health);
    modelStore.eaMetricTotalBands.replace(bands);
  },

  loadEaHealthDetail: async (eaArtifactId) => {
    if (modelStore.eaArtifactHealthDetails.some(a => a.eaArtifactId === eaArtifactId)) {
      return;
    }
    const detailData = await api.getEaArtifactHealthDetail(eaArtifactId);
    modelStore.eaArtifactHealthDetails.push(detailData);
  },

};

export default modelStore;
