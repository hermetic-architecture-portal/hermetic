import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { features } from 'hermetic-common';
import './styles/App.scss';
import Loading from './components/shared/Loading';
import Header from './components/shared/Header';
import viewRoutes from './viewRoutes';
import editor from './editor';
import userStore from './stores/userStore';

const app = () => {
  let editRoutes;
  if (userStore.data.allowedFeatures.includes(features.techDetails)) {
    editRoutes = editor.getRoutes();
  }
  const viewRoutesJSX = viewRoutes
    .map(r => <Route path={r.path} component={r.component} exact={true} key={r.path} />);
  return <Router>
    <div>
      <Loading/>
      <Header/>
      {viewRoutesJSX}
      {editRoutes}
      <div className="Footer">
        <div className="Footer-placeholder" />
      </div>
    </div>
  </Router>;
};

export default app;
