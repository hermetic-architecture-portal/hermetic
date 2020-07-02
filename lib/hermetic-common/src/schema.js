import VanillaJoi from 'joi';
import { fkExtension, pkExtension } from 'joi-key-extensions';

const Joi = VanillaJoi
  .extend(fkExtension.string)
  .extend(pkExtension.array)
  .extend(pkExtension.string)
  .extend(pkExtension.number);

/* eslint-disable max-len */

const link = Joi.object({
  url: Joi.string().required().uri()
    .pk()
    .meta({ displayName: true })
    .description('The web URL'),
  text: Joi.string().optional().max(104)
    .description('The text to display in the link'),
});

const links = Joi.array().items(link)
  .uniqueOnPks()
  .optional();

const valueChainSegmentSchema = Joi.object({
  valueChainSegmentId: Joi.string().required()
    .pk(),
  name: Joi.string().required().max(70).meta({ displayName: true }),
  displayOrder: Joi.number().optional()
    .description('This field controls the display order of segments.  Lower numbers appear sooner.'),
});

const valueChainSchema = Joi.object({
  valueChainId: Joi.string().required()
    .pk(),
  capabilityTypeId: Joi.string().required()
    .fk('capabilityTypes.[].capabilityTypeId'),
  name: Joi.string().required().max(70).meta({ displayName: true }),
  valueChainSegments: Joi.array().items(valueChainSegmentSchema).uniqueOnPks(),
});

const capabilitySchema = Joi.object({
  capabilityId: Joi.string().required()
    .pk(),
  capabilityTypeId: Joi.string().required()
    .fk('capabilityTypes.[].capabilityTypeId'),
  parentCapabilityId: Joi.string()
    .fk('capabilities.[].capabilityId')
    .description('parentCapability identifies the parent of this capability in a hierarchy of capabilities'),
  name: Joi.string().required().max(70).meta({ displayName: true }),
  description: Joi.string().optional().max(1024),
  valueChainSegments: Joi.array().items({
    valueChainId: Joi.string().fk('valueChains.[].valueChainId')
      .required().pk(),
    valueChainSegmentId: Joi.string()
      .fk('valueChains.[].valueChainSegments.[].valueChainSegmentId',
        { parentFieldPath: 'capabilities.[].valueChainSegments.[].valueChainId' })
      .required().pk(),
  }).optional().uniqueOnPks(),
  links: links.description('Hyperlinks which provide further information on the capability'),
});

const capabilityResourcingSchema = Joi.object({
  capabilityId: Joi.string().fk('capabilities.[].capabilityId').required()
    .pk()
    .meta({ displayName: true }),
  headcount: Joi.number().optional()
    .description('headcount is an optional field to represent the number of staff engaged with delivering a capability'),
});

const capabilityTypeSchema = Joi.object({
  capabilityTypeId: Joi.string().required()
    .pk(),
  name: Joi.string().required().max(70).meta({ displayName: true }),
});

const dataConnectionSchema = Joi.object({
  fromTechnologyId: Joi.string().fk('technologies.[].technologyId').required()
    .pk()
    .meta({ displayName: true }),
  toTechnologyId: Joi.string().fk('technologies.[].technologyId').required()
    .pk()
    .meta({ displayName: true }),
  summary: Joi.string().optional(),
  description: Joi.string().optional().max(1024),
});

const vendor = Joi.object({
  vendorId: Joi.string().required().pk(),
  name: Joi.string().required().max(70).meta({ displayName: true }),
  externalIdentifiers: Joi.array().items(Joi.string()).optional()
    .description('A list of references to identifiers in external systems'),
});

const technologySchema = Joi.object({
  technologyId: Joi.string().required()
    .pk(),
  vendorId: Joi.string().optional()
    .fk('vendors.[].vendorId'),
  additionalVendors: Joi.array().optional().items({
    vendorId: Joi.string().fk('vendors.[].vendorId').required().pk(),
    relationship: Joi.string().optional().max(70),
  }).uniqueOnPks()
    .description('Other vendors who have a relationship to the technology, e.g. providing contracted support'),
  name: Joi.string().required().max(70).meta({ displayName: true }),
  parentTechnologyId: Joi.string().optional()
    .fk('technologies.[].technologyId')
    .description('Typical usage: multiple versions of a technology are recorded and linked to a single parent technology representing the non-version specific technology.'),
  userApplication: Joi.boolean().optional()
    .description('If true, indicates that this technology is a user facing application.'),
  purpose: Joi.string().optional().max(1024),
  businessOwner: Joi.string().optional(),
  aka: Joi.string().optional().description('Alternative name for technology'),
  disasterRecovery: Joi.string().optional(),
  technologyType: Joi.string().optional()
    .allow('Client/server', 'SaaS', 'Server only', 'Support service', 'Platform'),
  slaLevel: Joi.number().optional()
    .description('SLA Level is used on the Health bubble chart to show the importance of a technology.\nLower numbers represent higher SLA level'),
  technologyCategoryId: Joi.string().fk('technologyCategories.[].technologyCategoryId').optional(),
  lifecycleStatus: Joi.string().optional(),
  lastReviewedOn: Joi.date().optional(),
  lastReviewedBy: Joi.string().optional(),
  armDomainId: Joi.string().fk('appReferenceModelDomains.[].armDomainId').optional()
    .description('The domain ID identifies how the technology is represented in the Application Reference Model'),
  standardLevelId: Joi.string().fk('technicalStandardLevels.[].levelId').optional(),
  standardNotes: Joi.string().optional().max(1024),
  supportingTechnologies: Joi.array().items({
    technologyId: Joi.string().fk('technologies.[].technologyId').required()
      .pk(),
  }).optional().uniqueOnPks()
    .description('Supporting technologies indicates which other technologies enable this technology'),
  capabilities: Joi.array().items(Joi.object({
    capabilityId: Joi.string().fk('capabilities.[].capabilityId')
      .pk(),
  })).optional().uniqueOnPks()
    .description('Capabilities are the high level business capabilities reflected in the Business Reference Model'),
  contacts: Joi.array().items(Joi.string()).optional(),
  generalLinks: links
    .description('Hyperlinks which provide non-technical information on the technology for general consumption'),
  technicalLinks: links
    .description('Hyperlinks which provide technical information on the technology and may not be shown for all users'),
  gdprAssessed: Joi.string().optional().valid('Yes', 'No')
    .description('Indicates whether an assessment for GDPR compliance has been undertaken.'),
  cloudRiskAssessed: Joi.string().optional().valid('Yes', 'No')
    .description('Indicates whether an assessment for cloud risk has been undertaken'),
  hasPrivateData: Joi.string().optional().valid('Yes', 'No'),
  authenticationInternalStore: Joi.string().optional().valid('Yes', 'No')
    .description('Indicates if there is an store of usernames and credentials internal to the technology'),
  authenticationTechnologyId: Joi.string().fk('technologies.[].technologyId').optional()
    .description('Identifies the technology which supplies authentication to this technology'),
  authenticationNotes: Joi.string().optional().max(1024),
  authorisationInternalStore: Joi.string().optional().valid('Yes', 'No')
    .description('Indicates if there is an store of access role/group memberships internal to the technology'),
  authorisationTechnologyId: Joi.string().fk('technologies.[].technologyId').optional()
    .description('Identifies the technology which supplies authorisation to this technology'),
  authorisationNotes: Joi.string().optional().max(1024),
  externalIdentifiers: Joi.array().items(Joi.string()).optional()
    .description('A list of references to identifiers in external systems, e.g. SKUs'),
});

const technologyCategory = Joi.object({
  technologyCategoryId: Joi.string().required().pk(),
  name: Joi.string().required().max(70).meta({ displayName: true }),
});

const businessUnitSchema = Joi.object({
  businessUnitId: Joi.string().required()
    .pk(),
  name: Joi.string().required().max(70).meta({ displayName: true }),
  description: Joi.string().optional().max(1024),
  capabilities: Joi.array().optional().uniqueOnPks().items({
    capabilityId: Joi.string().fk('capabilities.[].capabilityId')
      .pk(),
  })
    .description('Capabilities identifies the capabilities that the business unit contributes to'),
  links: links.description('Hyperlinks which provide more information on the business unit'),
});

const networkNodeSchema = Joi.object({
  nodeId: Joi.string().required()
    .pk()
    .meta({ displayName: true }),
  isAbstractNode: Joi.boolean().optional()
    .description('Abstract nodes represent a server role (e.g. "Domain controller") rather than an actual individual server (e.g. "sydney-dc-prod1")'),
  nodeType: Joi.string().optional()
    .allow('Database', 'Desktop', 'Mobile Device', 'Cluster', 'Load Balancer', 'Load Balancer Alias', 'Server'),
  locationId: Joi.string().fk('networkLocations.[].locationId')
    .when('isAbstractNode', { is: true, then: Joi.string().required() })
    .description('A location from networkLocations'),
  implementsNodes: Joi.array().items(Joi.object({
    nodeId: Joi.string().required()
      .fk('networkNodes.[].nodeId')
      .pk(),
  })).description('A node that represents an actual piece of infrastructure may implement an abstract node'),
  environmentId: Joi.string().fk('deploymentEnvironments.[].environmentId')
    .when('isAbstractNode', { is: true, then: Joi.any().forbidden(), otherwise: Joi.string().required() }),
  technologies: Joi.array().items(Joi.object({
    technologyId: Joi.string().fk('technologies.[].technologyId').required().pk(),
  })).uniqueOnPks(),
});

const networkLocationSchema = Joi.object({
  locationId: Joi.string().required()
    .pk(),
  name: Joi.string().required().max(70).meta({ displayName: true }),
});

const deploymentEnvironmentSchema = Joi.object({
  environmentId: Joi.string().required()
    .pk(),
  name: Joi.string().required().max(70).meta({ displayName: true }),
});

const networkConnectionSchema = Joi.object({
  fromNodeId: Joi.string().fk('networkNodes.[].nodeId').required()
    .pk()
    .meta({ displayName: true }),
  toNodeId: Joi.string().fk('networkNodes.[].nodeId').required()
    .pk()
    .meta({ displayName: true }),
  summary: Joi.string().optional(),
  description: Joi.string().optional().max(1024),
  protocol: Joi.string().optional(),
  port: Joi.number().integer().optional(),
  technologies: Joi.array().items(Joi.object({
    technologyId: Joi.string().fk('technologies.[].technologyId').required()
      .pk(),
  })).optional().uniqueOnPks(),
});

const metricBand = Joi.object({
  bandId: Joi.string().required().pk(),
  minPercent: Joi.number().required(),
  maxPercentExclusive: Joi.number().required(),
  name: Joi.string().required().max(70).meta({ displayName: true })
    .description('The title of the band displayed to the user (e.g. Good, OK, Poor)'),
  levelNumber: Joi.number().integer().required()
    .min(1)
    .max(5)
    .description('levelNumber is used to determine how to display the band in the user interface.\nA higher number represents a higher / better metric.'),
});

const metricSet = Joi.object({
  metricSetId: Joi.string().required().pk(),
  name: Joi.string().required().meta({ displayName: true }),
  metrics: Joi.array().items({
    metricId: Joi.string().required().pk().fk('metrics.[].metricId'),
  }).uniqueOnPks(),
});

const metric = Joi.object({
  metricId: Joi.string().required().pk().description('Unique identifier for the metric'),
  name: Joi.string().required().max(70).meta({ displayName: true })
    .description('The name of the metric which will display in the models'),
  description: Joi.string().required().max(1024).description('A brief summary of what the metric means and how to assess it'),
  category: Joi.string().required()
    .description('Free text category which drives how metrics are displayed and aggregated in assessments'),
  minScore: Joi.number().required()
    .description('Minimum score that can be applied to this metric when doing an assessment.'),
  maxScore: Joi.number().required().description('Maximum score that can be applied to a metric when doing an assessment -  Higher score=better'),
}).meta({ fullEntityInSummary: true });

const metricAssessment = Joi.object({
  metricId: Joi.string().required().pk().fk('metrics.[].metricId')
    .meta({ displayName: true }),
  score: Joi.number().required().description('Scoring assumes higher = better, even if the metric description is negative (e.g. Technical Debt)'),
  reason: Joi.string().optional().max(100).description('Optionally, specify the rationale behind the assessed score'),
});

const technologyMetricAssessmentSet = Joi.object({
  technologyId: Joi.string().fk('technologies.[].technologyId').required().pk()
    .meta({ displayName: true }),
  metricSetId: Joi.string().fk('technologyMetricSets.[].metricSetId').required(),
  assessments: Joi.array().uniqueOnPks().items(metricAssessment),
});

const capabilityMetricAssessmentSet = Joi.object({
  capabilityId: Joi.string().fk('capabilities.[].capabilityId').required().pk()
    .meta({ displayName: true }),
  metricSetId: Joi.string().fk('capabilityMetricSets.[].metricSetId').required(),
  assessments: Joi.array().uniqueOnPks().items(metricAssessment),
});

const component = Joi.object({
  componentId: Joi.string().required().pk().meta({ displayName: true }),
  actor: Joi.bool().optional()
    .description('Set this to true to indicate that the component is an actor / user / person'),
  description: Joi.string().optional().max(1024),
  interfaces: Joi.array().items(Joi.object({
    interfaceId: Joi.string().pk().meta({ displayName: true }),
    description: Joi.string().optional().max(1024),
  })).optional().uniqueOnPks()
    .description('Components may define one or more interfaces other components can access them by.\nAlternatively components can be accessed directly'),
  technologies: Joi.array().items(Joi.object({
    technologyId: Joi.string().fk('technologies.[].technologyId').required().pk(),
  })).optional().uniqueOnPks()
    .description('Use this property to relate components to the technologies they make up'),
});

const componentConnection = Joi.object({
  fromComponentId: Joi.string().fk('components.[].componentId').required().pk()
    .meta({ displayName: true }),
  toComponentId: Joi.string().fk('components.[].componentId').required().pk()
    .meta({ displayName: true }),
  toInterfaceId: Joi.string()
    .fk('components.[].interfaces.[].interfaceId',
      { parentFieldPath: 'componentConnections.[].toComponentId' })
    .optional().pk()
    .meta({ displayName: true })
    .description('Component connections may be component to component or component to component\'s interface'),
  description: Joi.string().optional().max(1024),
  tags: Joi.array().items(Joi.string()).optional()
    .description('App users can filter component diagrams based on the tags.  This can be used to indicate multiple phases of an architecture'),
});

const componentDeployment = Joi.object({
  componentId: Joi.string().fk('components.[].componentId').required().pk()
    .meta({ displayName: true })
    .description('The component that is deployed (from components)'),
  nodeId: Joi.string().fk('networkNodes.[].nodeId').required().pk()
    .meta({ displayName: true })
    .description('The node from networkNodes the component is deployed on'),
  executionEnvironment: Joi.string().optional()
    .description('A description of of the runtime / framework the component is running on'),
});

const technicalReferenceModelCategory = Joi.object({
  trmCategoryId: Joi.string()
    .required()
    .pk(),
  name: Joi.string().required().max(70).meta({ displayName: true }),
  trmLayerId: Joi.string().required()
    .fk('technicalReferenceModelLayers.[].trmLayerId'),
  technologies: Joi.array().optional().items({
    technologyId: Joi.string().fk('technologies.[].technologyId').required()
      .pk(),
  }).uniqueOnPks(),
});

const technicalReferenceModelLayer = Joi.object({
  trmLayerId: Joi.string()
    .required()
    .pk(),
  name: Joi.string().required().max(70).meta({ displayName: true }),
});

const technicalStandardLevel = Joi.object({
  levelId: Joi.string()
    .required().pk(),
  name: Joi.string().required().max(30).meta({ displayName: true }),
  levelNumber: Joi.number().integer().required()
    .min(1)
    .max(5)
    .description('levelNumber is used to determine how to display the level in the user interface.\nA higher number represents a higher / better level of standard.'),
});

const appReferenceModelDomainGroup = Joi.object({
  armDomainGroupId: Joi.string().required().pk(),
  name: Joi.string().required().max(70).meta({ displayName: true }),
  displayOrder: Joi.number().optional()
    .description('This field controls the display order.  Lower numbers appear sooner.'),
});

const appReferenceModelDomain = Joi.object({
  armDomainId: Joi.string().required().pk(),
  armDomainGroupId: Joi.string().required().fk('appReferenceModelDomainGroups.[].armDomainGroupId'),
  name: Joi.string().required().max(70).meta({ displayName: true }),
  displayOrder: Joi.number().optional()
    .description('This field controls the display order.  Lower numbers appear sooner.'),
  parentArmDomainId: Joi.string().optional()
    .fk('appReferenceModelDomains.[].armDomainId'),
});

const dataTopicType = Joi.object({
  dataTopicTypeId: Joi.string().required().pk(),
  name: Joi.string().required().max(30).meta({ displayName: true }),
});

const dataTopic = Joi.object({
  dataTopicId: Joi.string().required().pk(),
  dataTopicTypeId: Joi.string()
    .fk('dataTopicTypes.[].dataTopicTypeId')
    .required(),
  name: Joi.string().required().max(30).meta({ displayName: true }),
});

const dataAccessRole = Joi.object({
  dataAccessRoleId: Joi.string().required().pk(),
  name: Joi.string().required().max(30).meta({ displayName: true }),
  rank: Joi.number().integer().required().min(1)
    .description('Rank describes an order of importance for the access roles\nWhere 1 is the highest importance (e.g. Master or Owner)'),
});

const dataEntity = Joi.object({
  dataEntityId: Joi.string().required().pk(),
  parentDataEntityId: Joi.string().optional()
    .fk('dataEntities.[].dataEntityId'),
  dataTopicId: Joi.string()
    .required()
    .fk('dataTopics.[].dataTopicId'),
  name: Joi.string().required().max(40).meta({ displayName: true }),
  description: Joi.string().optional().max(1024),
  links: links.description('Hyperlinks which provide more information on the data entity'),
  technologies: Joi.array().optional().items({
    technologyId: Joi.string().required().pk()
      .fk('technologies.[].technologyId')
      .meta({ displayName: true }),
    dataAccessRoleId: Joi.string().required()
      .fk('dataAccessRoles.[].dataAccessRoleId')
      .meta({ displayName: true }),
    description: Joi.string().optional().max(70),
  }).uniqueOnPks(),
});

const eaDomain = Joi.object({
  eaDomainId: Joi.string().required().pk(),
  name: Joi.string().required().max(30).meta({ displayName: true }),
  isCrossCutting: Joi.boolean().optional()
    .description('If true, indicates that this domain cuts across all other domains'),
  description: Joi.string().optional().max(1024),
  displayOrder: Joi.number().optional()
    .description('This field controls the display order of domains.  Lower numbers appear sooner.'),
});

const eaArtifact = Joi.object({
  eaArtifactId: Joi.string().required().pk(),
  name: Joi.string().required().max(50).meta({ displayName: true }),
  description: Joi.string().optional().max(1024),
  eaDomainId: Joi.string().required().fk('eaDomains.[].eaDomainId'),
  links: links.description('Hyperlinks which provide further information on the artifact'),
});

const eaArtifactMetricAssessmentSet = Joi.object({
  eaArtifactId: Joi.string().fk('eaArtifacts.[].eaArtifactId').required().pk()
    .meta({ displayName: true }),
  metricSetId: Joi.string().fk('eaArtifactMetricSets.[].metricSetId').required(),
  assessments: Joi.array().uniqueOnPks().items(metricAssessment),
});

const functionalCapabilitySchema = Joi.object({
  functionalCapabilityId: Joi.string().required()
    .pk(),
  trmCategoryId: Joi.string().optional()
    .label('Tech Ref Model Category')
    .fk('technicalReferenceModelCategories.[].trmCategoryId'),
  name: Joi.string().required().max(70).meta({ displayName: true }),
  description: Joi.string().optional().max(1024),
  links: links.description('Hyperlinks which provide further information on the capability'),
  technologies: Joi.array().items({
    technologyId: Joi.string().required().pk()
      .fk('technologies.[].technologyId')
      .meta({ displayName: true }),
    remarks: Joi.string().optional().max(1024),
  }).uniqueOnPks()
    .description('Technologies identifies the technologies which supply the functional capabilities'),
});

const technologyCostSchema = Joi.object({
  vendorId: Joi.string().fk('vendors.[].vendorId').optional().pk(),
  technologyId: Joi.string().fk('technologies.[].technologyId').optional().pk(),
  year: Joi.number().integer().required().pk(),
  category: Joi.string().required().max(70).pk(),
  cost: Joi.number().required(),
});

const schema = Joi.object({
  capabilities: Joi.array().items(capabilitySchema).optional().uniqueOnPks(),
  valueChains: Joi.array().items(valueChainSchema).optional().uniqueOnPks(),
  capabilityTypes: Joi.array().items(capabilityTypeSchema).optional().uniqueOnPks(),
  capabilityResourcing: Joi.array().items(capabilityResourcingSchema).optional().uniqueOnPks()
    .description('Capability Resourcing describes the resources allocated to providing the capability'),
  technologies: Joi.array().items(technologySchema).optional().uniqueOnPks()
    .description('Technologies represent software or hardware'),
  dataConnections: Joi.array().items(dataConnectionSchema).optional().uniqueOnPks()
    .description('Data Connections describe the high level flows of data between technologies'),
  businessUnits: Joi.array().items(businessUnitSchema).optional().uniqueOnPks()
    .description('Business units represent organisational sections which may contribute to capabilities'),
  networkLocations: Joi.array().items(networkLocationSchema).optional().uniqueOnPks(),
  networkNodes: Joi.array().items(networkNodeSchema).optional().uniqueOnPks()
    .description('Network Nodes represent servers, databases and other physical or virtual devices.\nNetwork Nodes may also represent abstract server roles, which are fulfilled by Environment Nodes'),
  networkConnections: Joi.array().items(networkConnectionSchema).optional().uniqueOnPks()
    .description('Network Connections represent network level connections between devices defined in networkNodes'),
  deploymentEnvironments: Joi.array().items(deploymentEnvironmentSchema).optional().uniqueOnPks()
    .description('Deployment Environments are the levels in the environment (e.g. Dev, Test, Prod) which a particular server may be assigned to'),
  components: Joi.array().items(component).optional().uniqueOnPks()
    .description('Components are used to describe an technology\'s architecture in terms of its functional components'),
  componentConnections: Joi.array().items(componentConnection).optional().uniqueOnPks()
    .description('Component Connections are used to describe the interactions between the functional components of an technology'),
  componentDeployments: Joi.array().items(componentDeployment).optional().uniqueOnPks()
    .description('Component Deployments show which servers particular components of an technology are deployed onto'),
  technicalReferenceModelLayers: Joi.array().items(technicalReferenceModelLayer).optional().uniqueOnPks()
    .description('The technical reference model is a system for organising the technological landscape into layers and categories'),
  technicalReferenceModelCategories: Joi.array().items(technicalReferenceModelCategory).optional().uniqueOnPks()
    .description('The technical reference model is a system for organising the technological landscape into layers and categories'),
  technicalStandardLevels: Joi.array().items(technicalStandardLevel).optional().uniqueOnPks()
    .description('Technical standard levels represent the different levels of standard that may be assigned to a technology.'),
  technologyCategories: Joi.array().items(technologyCategory).optional().uniqueOnPks(),
  dataTopicTypes: Joi.array().items(dataTopicType).optional().uniqueOnPks()
    .description('Data topic types categorise data at a very high level'),
  dataTopics: Joi.array().items(dataTopic).optional().uniqueOnPks()
    .description('Data topics categorise data'),
  dataEntities: Joi.array().items(dataEntity).optional().uniqueOnPks()
    .description('Data entities describe the data objects which exist in the architecture'),
  dataAccessRoles: Joi.array().items(dataAccessRole).uniqueOnPks()
    .description('Data access roles describe levels of access to data entities (e.g. "Reader", "Writer", "Master"'),
  technologyMetricBands: Joi.array().items(metricBand).optional().uniqueOnPks()
    .description('Technology metric bands define the scoring system for technology assessments'),
  capabilityMetricBands: Joi.array().items(metricBand).optional().uniqueOnPks()
    .description('Capability metric bands define the scoring system for technology assessments'),
  metrics: Joi.array().items(metric).optional().uniqueOnPks()
    .description('Metrics define possible measurements which may be taken of an entitity'),
  technologyMetricSets: Joi.array().items(metricSet).optional().uniqueOnPks()
    .description('Technology metric sets define different ways of measuring technologies'),
  capabilityMetricSets: Joi.array().items(metricSet).optional().uniqueOnPks()
    .description('Capability metric sets define different ways of measuring business capabilities'),
  eaArtifactMetricSets: Joi.array().items(metricSet).optional().uniqueOnPks()
    .description('EA artifact metric sets define different ways of measuring Enterprise Architecture artifacts'),
  eaArtifactMetricBands: Joi.array().items(metricBand).optional().uniqueOnPks()
    .description('EA artifact metric bands define the scoring system for Enterprise Architecture artifacts'),
  eaDomains: Joi.array().items(eaDomain).optional().uniqueOnPks()
    .description('EA domains segment the fields of activity in an Enterprise Architecture'),
  eaArtifacts: Joi.array().items(eaArtifact).optional().uniqueOnPks()
    .description('EA artifacts represent the documents and models which describe and/or direct the Enterprise Architecture'),
  appReferenceModelDomainGroups: Joi.array().items(appReferenceModelDomainGroup).optional().uniqueOnPks()
    .description('Application Reference Model domains groups organise the clusters of domains in the models'),
  appReferenceModelDomains: Joi.array().items(appReferenceModelDomain).optional().uniqueOnPks()
    .description('Application Reference Model domains represent the spheres of activity defined in the model'),
  eaArtifactMetricAssessments: Joi.array().items(eaArtifactMetricAssessmentSet).optional().uniqueOnPks(),
  technologyMetricAssessments: Joi.array().items(technologyMetricAssessmentSet).optional().uniqueOnPks(),
  capabilityMetricAssessments: Joi.array().items(capabilityMetricAssessmentSet).optional().uniqueOnPks(),
  vendors: Joi.array().items(vendor).optional().uniqueOnPks(),
  functionalCapabilities: Joi.array().items(functionalCapabilitySchema).optional().uniqueOnPks()
    .description('EXPERIMENTAL FEATURE! Functional capabilites are low level capabilities of applications and technologies'),
  technologyCosts: Joi.array().items(technologyCostSchema).optional().uniqueOnPks(),
});

export default schema;
