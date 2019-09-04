import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import TechnologyDetail from './TechnologyDetail';
import TechnologyConnections from './TechnologyConnections';
import modelStore from '../../stores/modelStore';

class Technology extends React.Component {
  componentDidMount() {
    modelStore.loadTechnologyDetail(this.props.technologyId);
  }

  render() {
    const tech = modelStore.technologyDetails
      .find(a => a.technologyId === this.props.technologyId);
    if (!tech) {
      return null;
    }
    const connections = !(tech.connections && tech.connections.length)
      ? undefined
      : <TechnologyConnections
        connections={tech.connections}
        technologies={tech.connectedTechnologies}
        name={tech.name}/>;
    return <div>
      <div className="Two-col-wrapper">
        <TechnologyDetail technology={tech}/>
        {connections}
      </div>
    </div>;
  }
}

export default observer(Technology);
