import React from 'react'; // eslint-disable-line no-unused-vars
import { Route } from 'react-router-dom';
import { EditRoutes, Loading } from 'react-auto-edit';
import { schema } from 'hermetic-common';
import HermeticEdit from './components/HermeticEdit';
import HermeticMenu from './components/HermeticMenu';
import HermeticEditApiProxy from './HermeticEditApiProxy';
import HermeticEditController from './HermeticEditController';
import HermeticUIFactory from './HermeticUIFactory';
import config from '../config';

const editor = {
  getRoutes: () => {
    const apiProxy = new HermeticEditApiProxy(
      schema,
      `${config.apiBaseUrl}/edit`,
    );
    const uiFactory = new HermeticUIFactory();
    const controller = new HermeticEditController(schema, apiProxy, {
      baseClientPath: '/edit',
      uiFactory,
    });
    return <React.Fragment>
        <Route path='/edit'
          component={() => <HermeticMenu controller={controller} />}
        />
        <Route path='/edit' exact={true}
          component={() => <HermeticEdit controller={controller} />}
        />
        <EditRoutes controller={controller} />
        <Loading controller={controller} />
    </React.Fragment>;
  },
};

export default editor;
