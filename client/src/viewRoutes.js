import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { features } from 'hermetic-common';
import CapabilityModel from './components/modelView/CapabilityModel';
import CapabilityDetail from './components/capability/CapabilityDetail';
import Technology from './components/technology/Technology';
import Technologies from './components/technology/Technologies';
import TechnologyTechDetails from './components/technology/TechnologyTechDetails';
import TechnologyComponents from './components/technology/TechnologyComponents';
import TechnologyHealth from './components/technology/TechnologyHealth';
import TechnologyHealthSummary from './components/healthSummary/TechnologyHealthSummary';
import Servers from './components/server/Servers';
import Server from './components/server/Server';
import TechnologyDeployment from './components/technology/TechnologyDeployment';
import TechRefModel from './components/techRefModel/TechRefModel';
import BusinessUnits from './components/businessUnit/BusinessUnits';
import BusinessUnit from './components/businessUnit/BusinessUnit';
import Vendor from './components/technology/Vendor';
import Vendors from './components/technology/Vendors';
import DataRefModel from './components/dataRefModel/DataRefModel';
import DataEntity from './components/data/DataEntity';
import AppRefModel from './components/appRefModel/AppRefModel';
import EARefModel from './components/ea/EARefModel';
import EAArtifactDetail from './components/ea/EAArtifactDetail';
import FunctionalCapabilities from './components/functionalCapabilities/FunctionalCapabilities';
import FunctionalCapabilityDetail
  from './components/functionalCapabilities/FunctionalCapabilityDetail';
import CompareTechnologies from './components/compareTechnologies/CompareTechnologies';
import Reporting from './components/reporting/Reporting';
import CostModel from './components/cost/CostModel';
import config from './config';
import constants from './constants';

const viewRoutes = [
  {
    path: config.resolvePathAgainstDefault('/businessRefModel'),
    component: () => <CapabilityModel/>,
    menu: {
      displayOrder: 2,
      crumbs: ['Business Reference Model'],
    },
  },
  {
    path: '/capability/:capabilityId',
    component: ({ match }) => <CapabilityDetail
      key={match.params.capabilityId}
      capabilityId={match.params.capabilityId} />,
    menu: {
      crumbs: ['Business Reference Model', constants.menuItemEntityId],
    },
  },
  {
    path: '/technologyHealthSummary',
    component: () => <TechnologyHealthSummary/>,
    menu: {
      displayOrder: 10,
      crumbs: ['Technology Health Summary'],
    },
    securityFeature: features.techDetails,
  },
  {
    path: '/technologies',
    component: () => <Technologies/>,
    menu: {
      displayOrder: 6,
      crumbs: ['Technology List'],
    },
  },
  {
    path: '/technology/:technologyId',
    component: ({ match }) => <Technology
      key={match.params.technologyId}
      technologyId={match.params.technologyId} />,
    menu: {
      crumbs: ['Technology List', constants.menuItemEntityId],
    },
  },
  {
    path: '/technology/:technologyId/technical',
    component: ({ match }) => <TechnologyTechDetails
      key={`${match.params.technologyId}-tech`}
      technologyId={match.params.technologyId} />,
    menu: {
      crumbs: ['Technology List', constants.menuItemEntityId, 'Technical'],
    },
    securityFeature: features.techDetails,
  },
  {
    path: '/technology/:technologyId/components',
    component: ({ match }) => <TechnologyComponents
      key={`${match.params.technologyId}-comp`}
      technologyId={match.params.technologyId} />,
    menu: {
      crumbs: ['Technology List', constants.menuItemEntityId, 'Components'],
    },
    securityFeature: features.techDetails,
  },
  {
    path: '/technology/:technologyId/deployment',
    component: ({ match }) => <TechnologyDeployment
      key={`${match.params.technologyId}-deploy`}
      technologyId={match.params.technologyId} />,
    menu: {
      crumbs: ['Technology List', constants.menuItemEntityId, 'Deployment'],
    },
    securityFeature: features.techDetails,
  },
  {
    path: '/technology/:technologyId/health',
    component: ({ match }) => <TechnologyHealth
      key={`${match.params.technologyId}-tech`}
      technologyId={match.params.technologyId} />,
    menu: {
      crumbs: ['Technology List', constants.menuItemEntityId, 'Health'],
    },
    securityFeature: features.technologyHealthMetrics,
  },
  {
    path: '/servers',
    component: () => <Servers/>,
    menu: {
      displayOrder: 11,
      crumbs: ['Server List'],
    },
    securityFeature: features.techDetails,
  },
  {
    path: '/server/:nodeId',
    component: ({ match }) => <Server
      key={match.params.nodeId}
      nodeId={match.params.nodeId} />,
    menu: {
      crumbs: ['Server List', constants.menuItemEntityId],
    },
    securityFeature: features.techDetails,
  },
  {
    path: config.resolvePathAgainstDefault('/techRefModel'),
    component: () => <TechRefModel/>,
    menu: {
      displayOrder: 5,
      crumbs: ['Technical Reference Model'],
    },
    securityFeature: features.techDetails,
  },
  {
    path: '/businessUnits',
    component: () => <BusinessUnits/>,
    menu: {
      displayOrder: 8,
      crumbs: ['Business Unit List'],
    },
  },
  {
    path: '/businessUnit/:businessUnitId',
    component: ({ match }) => <BusinessUnit businessUnitId={match.params.businessUnitId} />,
    menu: {
      crumbs: ['Business Unit List', constants.menuItemEntityId],
    },
  },
  {
    path: '/costModel',
    component: () => <CostModel />,
    menu: {
      displayOrder: 9,
      crumbs: ['Cost Model'],
    },
    securityFeature: features.cost,
  },
  {
    path: '/vendors',
    component: () => <Vendors />,
    menu: {
      displayOrder: 7,
      crumbs: ['Vendor List'],
    },
  },
  {
    path: '/vendor/:vendorId',
    component: ({ match }) => <Vendor vendorId={match.params.vendorId} />,
    menu: {
      crumbs: ['Vendor List', constants.menuItemEntityId],
    },
  },
  {
    path: config.resolvePathAgainstDefault('/dataRefModel'),
    component: () => <DataRefModel/>,
    menu: {
      displayOrder: 3,
      crumbs: ['Data Reference Model'],
    },
  },
  {
    path: '/entity/:dataEntityId',
    component: ({ match }) => <DataEntity
      key={match.params.dataEntityId}
      dataEntityId={match.params.dataEntityId} />,
    menu: {
      crumbs: ['Data Reference Model', constants.menuItemEntityId],
    },
  },
  {
    path: config.resolvePathAgainstDefault('/appRefModel'),
    component: () => <AppRefModel/>,
    menu: {
      displayOrder: 4,
      crumbs: ['Application Reference Model'],
    },
  },
  {
    path: config.resolvePathAgainstDefault('/eaRefModel'),
    component: () => <EARefModel/>,
    menu: {
      displayOrder: 1,
      crumbs: ['Enterprise Architecture Model'],
    },
  },
  {
    path: '/eaArtifact/:eaArtifactId',
    component: ({ match }) => <EAArtifactDetail
      key={match.params.eaArtifactId}
      eaArtifactId={match.params.eaArtifactId} />,
    menu: {
      crumbs: ['Enterprise Architecture Model', constants.menuItemEntityId],
    },
  },
  {
    path: '/functionalCapabilities',
    component: () => <FunctionalCapabilities />,
    menu: {
      displayOrder: 12,
      crumbs: ['Functional Capabilities'],
    },
    securityFeature: features.techDetails,
  },
  {
    path: '/functionalCapability/:functionalCapabilityId',
    component: ({ match }) => <FunctionalCapabilityDetail
      key={match.params.functionalCapabilityId}
      functionalCapabilityId={match.params.functionalCapabilityId} />,
    menu: {
      crumbs: ['Functional Capabilities', constants.menuItemEntityId],
    },
    securityFeature: features.techDetails,
  },
  {
    path: '/compareTechnologies',
    component: () => <CompareTechnologies />,
    menu: {
      displayOrder: 13,
      crumbs: ['Compare Technologies'],
    },
  },
  {
    path: '/reporting',
    component: () => <Reporting/>,
    menu: {
      displayOrder: 14,
      crumbs: ['Reporting'],
    },
    securityFeature: features.reporting,
  },
];

viewRoutes.forEach((r) => {
  // eslint-disable-next-line no-param-reassign
  r.exact = true;
});

export default viewRoutes;
