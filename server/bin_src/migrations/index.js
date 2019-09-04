import dropEnvironmentNodes from './dropEnvironmentNodes';
import flattenCapabilities from './flattenCapabilities';
import dropNetworkNodeName from './dropNetworkNodeName';
import flattenTechnicalReferenceModel from './flattenTechnicalReferenceModel';
import normaliseMetrics from './normaliseMetrics';
import normaliseComponents from './normaliseComponents';

export default [
  dropEnvironmentNodes,
  flattenCapabilities,
  dropNetworkNodeName,
  flattenTechnicalReferenceModel,
  normaliseMetrics,
  normaliseComponents,
];
