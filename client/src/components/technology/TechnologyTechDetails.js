import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import TechDetailsText from './TechDetailsText';
import NetworkConnections from '../shared/NetworkConnections';

class TechnologyTechDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { environmentId: 'default' };
    this.environmentChanged = this.environmentChanged.bind(this);
  }

  environmentChanged(event) {
    this.setState({ environmentId: event.target.value });
  }

  componentDidMount() {
    modelStore.loadTechnologyTechDetail(this.props.technologyId);
  }

  render() {
    const tech = modelStore.technologyTechDetails
      .find(a => a.technologyId === this.props.technologyId);
    if (!tech) {
      return null;
    }
    const environmentOptions = tech.environments.map(e => <option
        value={e.environmentId} key={e.environmentId}>
        {e.name}
      </option>);
    return <div>
      <div className="Environments-choice">
        <label>
          Environment:
          <select value={this.state.environmentId} onChange={this.environmentChanged}>
            <option value="default">Default</option>
            {environmentOptions}
          </select>
        </label>
      </div>
      <div className="Two-col-wrapper">
        <TechDetailsText technology={tech} environmentId={this.state.environmentId}/>
        <NetworkConnections connections={tech.connections}
          identifier={tech.technologyId}
          nodes={tech.nodes}
          networkLocations={tech.networkLocations}
          environmentId={this.state.environmentId}
          key={`${tech.technologyId}-${this.state.environmentId}`}/>
      </div>
    </div>;
  }
}

export default observer(TechnologyTechDetails);
