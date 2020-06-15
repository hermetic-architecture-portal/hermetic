import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import AppRefModelDomainGroup from './AppRefModelDomainGroup';
import AppRefModelOverlays from './AppRefModelOverlays';

class AppRefModel extends React.Component {
  componentDidMount() {
    modelStore.loadAppRefModelDomainGroups();
    modelStore.loadAppRefModelDomains();
    modelStore.loadAppRefModelTechnologies();
  }

  render() {
    const domainGroups = modelStore.appRefModelDomainGroups
      .map(group => <AppRefModelDomainGroup group={group} key={group.armDomainGroupId} />);
    return <div className="app-ref-model">
      <AppRefModelOverlays />
      <div>
        {domainGroups}
      </div>
    </div>;
  }
}

export default observer(AppRefModel);
