import { features } from 'hermetic-common';

const capabilityOverlays = {
  businessUnits: 'businessUnits',
  technologies: 'technologies',
  technologyHealth: 'technologyHealth',
  capabilityHealth: 'capabilityHealth',
  capabilityHeadcount: 'capabilityHeadcount',
};

const capabilityOverlayFeature = {
  technologies: features.core,
  capabilityHealth: features.capabilityHealthMetrics,
  technologyHealth: features.technologyHealthMetrics,
  capabilityHeadcount: features.capabilityResourcing,
  businessUnits: features.core,
};

const techRefModelOverlays = {
  technologies: 'technologies',
  technologyHealth: 'technologyHealth',
  standardAssessments: 'standardAssessments',
  functionalCapabilities: 'functionalCapabilities',
};

const techRefModelOverlayFeature = {
  technologies: features.techDetails,
  technologyHealth: features.techDetails,
  standardAssessments: features.techDetails,
  functionalCapabilities: features.techDetails,
};

const eaRefModelOverlays = {
  eaHealth: 'Health',
};

const eaRefModelOverlayFeature = {
  eaHealth: features.eaHealthMetrics,
};

const appRefModelOverlays = {
  techHealth: 'Health',
};

const appRefModelOverlayFeature = {
  techHealth: features.technologyHealthMetrics,
};


const constants = {
  capabilityOverlays,

  capabilityOverlayFeature,

  defaultCapabilityOverlays: [],

  techRefModelOverlays,

  techRefModelOverlayFeature,

  defaultTechRefModelOverlays: [
    techRefModelOverlays.technologies,
  ],

  eaRefModelOverlays,

  eaRefModelOverlayFeature,

  defaultEaRefModelOverlays: [],

  appRefModelOverlays,

  appRefModelOverlayFeature,

  defaultAppRefModelOverlays: [],
};

export default constants;
