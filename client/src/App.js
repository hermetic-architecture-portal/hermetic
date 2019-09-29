import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { BrowserRouter as Router, Route } from 'react-router-dom';
import editPlugin from 'hermetic-edit-client-plugin';
import plugin from 'hermetic-client-plugin';
import { schema } from 'hermetic-common';
import './App.scss';
import 'hermetic-client-plugin/Custom.scss';
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
import Header from './components/shared/Header';
import Loading from './components/shared/Loading';
import BusinessUnits from './components/businessUnit/BusinessUnits';
import BusinessUnit from './components/businessUnit/BusinessUnit';
import DataRefModel from './components/dataRefModel/DataRefModel';
import DataEntity from './components/data/DataEntity';
import EARefModel from './components/ea/EARefModel';
import config from './config';
import EAArtifactDetail from './components/ea/EAArtifactDetail';

const app = () => {
  let editRoutes;
  if (editPlugin.getRoutes) {
    editRoutes = editPlugin.getRoutes(
      schema,
      config.apiBaseUrl,
      plugin.getAuthToken,
    );
  }
  return <Router>
    <div>
      <Loading/>
      <Header/>
      <Route path={config.resolvePathAgainstDefault('/businessRefModel')} exact={true}
        component={() => <CapabilityModel/>}
      />
      <Route path='/capability/:capabilityId' exact={true}
        component={({ match }) => <CapabilityDetail
          key={match.params.capabilityId}
          capabilityId={match.params.capabilityId} />}
      />
      <Route path='/technologyHealthSummary' exact={true}
        component={() => <TechnologyHealthSummary/>}
      />
      <Route path='/technologies' exact={true}
        component={() => <Technologies/>}
      />
      <Route path='/technology/:technologyId' exact={true}
        component={({ match }) => <Technology
          key={match.params.technologyId}
          technologyId={match.params.technologyId} />}
      />
      <Route path='/technology/:technologyId/technical' exact={true}
        component={({ match }) => <TechnologyTechDetails
          key={`${match.params.technologyId}-tech`}
          technologyId={match.params.technologyId} />}
      />
      <Route path='/technology/:technologyId/components' exact={true}
        component={({ match }) => <TechnologyComponents
          key={`${match.params.technologyId}-comp`}
          technologyId={match.params.technologyId} />}
      />
      <Route path='/technology/:technologyId/deployment' exact={true}
        component={({ match }) => <TechnologyDeployment
          key={`${match.params.technologyId}-deploy`}
          technologyId={match.params.technologyId} />}
      />
      <Route path='/technology/:technologyId/health' exact={true}
        component={({ match }) => <TechnologyHealth
          key={`${match.params.technologyId}-tech`}
          technologyId={match.params.technologyId} />}
      />
      <Route path='/servers' exact={true}
        component={() => <Servers/>}
      />
      <Route path='/server/:nodeId' exact={true}
        component={({ match }) => <Server
          key={match.params.nodeId}
          nodeId={match.params.nodeId} />}
      />
      <Route path={config.resolvePathAgainstDefault('/techRefModel')} exact={true}
        component={() => <TechRefModel/>}
      />
      <Route path='/businessUnits' exact={true}
        component={() => <BusinessUnits/>}
      />
      <Route path='/businessUnit/:businessUnitId' exact={true}
        component={({ match }) => <BusinessUnit businessUnitId={match.params.businessUnitId} />}
      />
      <Route path={config.resolvePathAgainstDefault('/dataRefModel')} exact={true}
        component={() => <DataRefModel/>}
      />
      <Route path='/entity/:dataEntityId' exact={true}
        component={({ match }) => <DataEntity
          key={match.params.dataEntityId}
          dataEntityId={match.params.dataEntityId} />}
      />
      <Route path={config.resolvePathAgainstDefault('/eaRefModel')} exact={true}
        component={() => <EARefModel/>}
      />
      <Route path='/eaArtifact/:eaArtifactId' exact={true}
        component={({ match }) => <EAArtifactDetail
          key={match.params.eaArtifactId}
          eaArtifactId={match.params.eaArtifactId} />}
      />
      {editRoutes}
      <div className="Footer">
        <div className="Footer-placeholder" />
      </div>
    </div>
  </Router>;
};

export default app;
