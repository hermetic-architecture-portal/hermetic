# Hermetic Model Schema #
```yaml
# businessUnits: optional array
# businessUnits: Business units represent organisational sections which may contribute to capabilities
businessUnits:
  - businessUnitId: string
    # capabilities: optional array
    # capabilities: Capabilities identifies the capabilities that the business unit contributes to
    capabilities:
        # capabilityId: refers to capabilities.[].capabilityId
      - capabilityId: string
    # description: optional
    description: string
    # links: optional array
    # links: Hyperlinks which provide more information on the business unit
    links:
        # text: optional
        # text: The text to display in the link
      - text: string
        # url: The web URL
        url: string
    name: string
# capabilities: optional array
capabilities:
  - capabilityId: string
    # capabilityTypeId: refers to capabilityTypes.[].capabilityTypeId
    capabilityTypeId: string
    # description: optional
    description: string
    # links: optional array
    # links: Hyperlinks which provide further information on the capability
    links:
        # text: optional
        # text: The text to display in the link
      - text: string
        # url: The web URL
        url: string
    name: string
    # parentCapabilityId: refers to capabilities.[].capabilityId
    # parentCapabilityId: parentCapability identifies the parent of this capability in a hierarchy of capabilities
    parentCapabilityId: string
    # valueChainSegments: optional array
    valueChainSegments:
        # valueChainId: refers to valueChains.[].valueChainId
      - valueChainId: string
        # valueChainSegmentId: refers to valueChains.[].valueChainSegments.[].valueChainSegmentId
        valueChainSegmentId: string
# capabilityMetricAssessments: optional array
capabilityMetricAssessments:
    # assessments: array
  - assessments:
        # metricId: refers to metrics.[].metricId
      - metricId: string
        # score: number
        # score: Scoring assumes higher = better, even if the metric description is negative (e.g. Technical Debt)
        score: 42
    # capabilityId: refers to capabilities.[].capabilityId
    capabilityId: string
    # metricSetId: refers to capabilityMetricSets.[].metricSetId
    metricSetId: string
# capabilityMetricBands: optional array
# capabilityMetricBands: Technology metric bands define the scoring system for technology assessments
capabilityMetricBands:
  - bandId: string
    # levelNumber: number
    # levelNumber: levelNumber is used to determine how to display the band in the user interface.
    # levelNumber: A higher number represents a higher / better metric.
    levelNumber: 42
    # maxPercentExclusive: number
    maxPercentExclusive: 42
    # minPercent: number
    minPercent: 42
    # name: The title of the band displayed to the user (e.g. Good, OK, Poor)
    name: string
# capabilityMetricSets: optional array
# capabilityMetricSets: Capability metric sets define different ways of measuring technologies
capabilityMetricSets:
    # metrics: array
  - metrics:
        # metricId: refers to metrics.[].metricId
      - metricId: string
    metricSetId: string
    name: string
# capabilityResourcing: optional array
# capabilityResourcing: Capability Resourcing describes the resources allocated to providing the capability
capabilityResourcing:
    # capabilityId: refers to capabilities.[].capabilityId
  - capabilityId: string
    # headcount: optional number
    # headcount: headcount is an optional field to represent the number of staff engaged with delivering a capability
    headcount: 42
# capabilityTypes: optional array
capabilityTypes:
  - capabilityTypeId: string
    name: string
# componentConnections: optional array
# componentConnections: Component Connections are used to describe the interactions between the functional components of an technology
componentConnections:
    # description: optional
  - description: string
    # fromComponentId: refers to components.[].componentId
    fromComponentId: string
    # tags: optional array
    # tags: App users can filter component diagrams based on the tags.  This can be used to indicate multiple phases of an architecture
    tags:
    - string
    # toComponentId: refers to components.[].componentId
    toComponentId: string
    # toInterfaceId: optional refers to components.[].interfaces.[].interfaceId
    # toInterfaceId: Component connections may be component to component or component to component's interface
    toInterfaceId: string
# componentDeployments: optional array
# componentDeployments: Component Deployments show which servers particular components of an technology are deployed onto
componentDeployments:
    # componentId: refers to components.[].componentId
    # componentId: The component that is deployed (from components)
  - componentId: string
    # executionEnvironment: optional
    # executionEnvironment: A description of of the runtime / framework the component is running on
    executionEnvironment: string
    # nodeId: refers to networkNodes.[].nodeId
    # nodeId: The node from networkNodes the component is deployed on
    nodeId: string
# components: optional array
# components: Components are used to describe an technology's architecture in terms of its functional components
components:
    # actor: optional boolean
    # actor: Set this to true to indicate that the component is an actor / user / person
  - actor: boolean
    componentId: string
    # description: optional
    description: string
    # interfaces: optional array
    # interfaces: Components may define one or more interfaces other components can access them by.
    # interfaces: Alternatively components can be accessed directly
    interfaces:
        # description: optional
      - description: string
        interfaceId: string
    # technologies: optional array
    # technologies: Use this property to relate components to the technologies they make up
    technologies:
        # technologyId: refers to technologies.[].technologyId
      - technologyId: string
# dataConnections: optional array
# dataConnections: Data Connections describe the high level flows of data between technologies
dataConnections:
    # description: optional
  - description: string
    # fromTechnologyId: refers to technologies.[].technologyId
    fromTechnologyId: string
    # summary: optional
    summary: string
    # toTechnologyId: refers to technologies.[].technologyId
    toTechnologyId: string
# dataEntities: optional array
# dataEntities: Data entities describe the data objects which exist in the architecture
dataEntities:
  - dataEntityId: string
    # dataTopicId: refers to dataTopics.[].dataTopicId
    dataTopicId: string
    # description: optional
    description: string
    # links: optional array
    # links: Hyperlinks which provide more information on the data entity
    links:
        # text: optional
        # text: The text to display in the link
      - text: string
        # url: The web URL
        url: string
    name: string
    # parentDataEntityId: optional refers to dataEntities.[].dataEntityId
    parentDataEntityId: string
# dataTopics: optional array
# dataTopics: Data topics categorise data
dataTopics:
  - dataTopicId: string
    # dataTopicTypeId: refers to dataTopicTypes.[].dataTopicTypeId
    dataTopicTypeId: string
    name: string
# dataTopicTypes: optional array
# dataTopicTypes: Data topic types categorise data at a very high level
dataTopicTypes:
  - dataTopicTypeId: string
    name: string
# deploymentEnvironments: optional array
# deploymentEnvironments: Deployment Environments are the levels in the environment (e.g. Dev, Test, Prod) which a particular server may be assigned to
deploymentEnvironments:
  - environmentId: string
    name: string
# metrics: optional array
# metrics: Metrics define possible measurements which may be taken of an entitity
metrics:
    # category: Category to group metrics into
  - category: string
    description: string
    # maxScore: number
    maxScore: 42
    metricId: string
    # minScore: number
    # minScore: Scoring assumes higher = better, even if the metric description is negative (e.g. Technical Debit)
    minScore: 42
    name: string
# networkConnections: optional array
# networkConnections: Network Connections represent network level connections between devices defined in networkNodes
networkConnections:
    # description: optional
  - description: string
    # fromNodeId: refers to networkNodes.[].nodeId
    fromNodeId: string
    # port: optional number
    port: 42
    # protocol: optional
    protocol: string
    # summary: optional
    summary: string
    # technologies: optional array
    technologies:
        # technologyId: refers to technologies.[].technologyId
      - technologyId: string
    # toNodeId: refers to networkNodes.[].nodeId
    toNodeId: string
# networkLocations: optional array
networkLocations:
  - locationId: string
    name: string
# networkNodes: optional array
# networkNodes: Network Nodes represent servers, databases and other physical or virtual devices.
# networkNodes: Network Nodes may also represent abstract server roles, which are fulfilled by Environment Nodes
networkNodes:
    # environmentId: refers to deploymentEnvironments.[].environmentId
  - environmentId: string
    # implementsNodes: array
    # implementsNodes: A node that represents an actual piece of infrastructure may implement an abstract node
    implementsNodes:
        # nodeId: refers to networkNodes.[].nodeId
      - nodeId: string
    # isAbstractNode: optional boolean
    # isAbstractNode: Abstract nodes represent a server role (e.g. "Domain controller") rather than an actual individual server
    isAbstractNode: boolean
    # locationId: refers to networkLocations.[].locationId
    locationId: string
    nodeId: string
    # nodeType: optional
    # nodeType: Free text node type category.
    # nodeType: Known values with mapped icons are: Database, Desktop, Mobile Device, Cluster, Load Balancer, Load Balancer Alias, Server
    nodeType: string
    # technologies: array
    technologies:
        # technologyId: refers to technologies.[].technologyId
      - technologyId: string
# technicalReferenceModelCategories: optional array
# technicalReferenceModelCategories: The technical reference model is a system for organising the technological landscape into layers and categories
technicalReferenceModelCategories:
  - name: string
    # technologies: optional array
    technologies:
        # technologyId: refers to technologies.[].technologyId
      - technologyId: string
    trmCategoryId: string
    # trmLayerId: refers to technicalReferenceModelLayers.[].trmLayerId
    trmLayerId: string
# technicalReferenceModelLayers: optional array
# technicalReferenceModelLayers: The technical reference model is a system for organising the technological landscape into layers and categories
technicalReferenceModelLayers:
  - name: string
    trmLayerId: string
# technicalStandardLevels: optional array
# technicalStandardLevels: Technical standard levels represent the different levels of standard that may be assigned to a technology.
technicalStandardLevels:
  - levelId: string
    # levelNumber: number
    # levelNumber: levelNumber is used to determine how to display the level in the user interface.
    # levelNumber: A higher number represents a higher / better level of standard.
    levelNumber: 42
    name: string
# technologies: optional array
# technologies: Technologies represent software or hardware
technologies:
    # aka: optional
    # aka: Alternative name for technology
  - aka: string
    # businessOwner: optional
    businessOwner: string
    # capabilities: optional array
    capabilities:
        # capabilityId: refers to capabilities.[].capabilityId
      - capabilityId: string
    # category: optional
    category: string
    # contacts: optional array
    contacts:
    - string
    # disasterRecovery: optional
    disasterRecovery: string
    # generalLinks: optional array
    # generalLinks: Hyperlinks which provide non-technical information on the technology for general consumption
    generalLinks:
        # text: optional
        # text: The text to display in the link
      - text: string
        # url: The web URL
        url: string
    # lastReviewedBy: optional
    lastReviewedBy: string
    # lastReviewedOn: optional date
    lastReviewedOn: date
    # lifecycleStatus: optional
    lifecycleStatus: string
    name: string
    # parentTechnologyId: optional refers to technologies.[].technologyId
    # parentTechnologyId: Typical usage: multiple versions of a technology are recorded and linked to a single parent technology representing the non-version specific technology.
    parentTechnologyId: string
    # purpose: optional
    purpose: string
    # slaLevel: optional number
    # slaLevel: SLA Level is used on the Health bubble chart to show the importance of a technology.
    # slaLevel: Lower numbers represent higher SLA level
    slaLevel: 42
    # standardLevelId: optional refers to technicalStandardLevels.[].levelId
    standardLevelId: string
    # standardNotes: optional
    standardNotes: string
    # supportingTechnologies: optional array
    # supportingTechnologies: Supporting technologies indicates which other technologies enable this technology
    supportingTechnologies:
        # technologyId: refers to technologies.[].technologyId
      - technologyId: string
    # technicalLinks: optional array
    # technicalLinks: Hyperlinks which provide technical information on the technology and may not be shown for all users
    technicalLinks:
        # text: optional
        # text: The text to display in the link
      - text: string
        # url: The web URL
        url: string
    technologyId: string
    # technologyType: optional
    # technologyType: Icons are available for the following values: Client/server, SaaS, Server only, Support service, Platform.
    # technologyType: Any other value can be used but will not be mapped to an icon.
    technologyType: string
    # userApplication: optional boolean
    # userApplication: If true, indicates that this technology is a user facing application.
    userApplication: boolean
# technologyMetricAssessments: optional array
technologyMetricAssessments:
    # assessments: array
  - assessments:
        # metricId: refers to metrics.[].metricId
      - metricId: string
        # score: number
        # score: Scoring assumes higher = better, even if the metric description is negative (e.g. Technical Debt)
        score: 42
    # metricSetId: refers to technologyMetricSets.[].metricSetId
    metricSetId: string
    # technologyId: refers to technologies.[].technologyId
    technologyId: string
# technologyMetricBands: optional array
# technologyMetricBands: Technology metric bands define the scoring system for technology assessments
technologyMetricBands:
  - bandId: string
    # levelNumber: number
    # levelNumber: levelNumber is used to determine how to display the band in the user interface.
    # levelNumber: A higher number represents a higher / better metric.
    levelNumber: 42
    # maxPercentExclusive: number
    maxPercentExclusive: 42
    # minPercent: number
    minPercent: 42
    # name: The title of the band displayed to the user (e.g. Good, OK, Poor)
    name: string
# technologyMetricSets: optional array
# technologyMetricSets: Technology metric sets define different ways of measuring technologies
technologyMetricSets:
    # metrics: array
  - metrics:
        # metricId: refers to metrics.[].metricId
      - metricId: string
    metricSetId: string
    name: string
# valueChains: optional array
valueChains:
    # capabilityTypeId: refers to capabilityTypes.[].capabilityTypeId
  - capabilityTypeId: string
    name: string
    valueChainId: string
    # valueChainSegments: array
    valueChainSegments:
        # displayOrder: optional number
        # displayOrder: This field controls the display order of segments.  Lower numbers appear sooner.
      - displayOrder: 42
        name: string
        valueChainSegmentId: string
```

 This file is autogenerated by server/bin/describe-schema.sh
