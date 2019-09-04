import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import ServerDetail from './ServerDetail';
import NetworkConnections from '../shared/NetworkConnections';

class Server extends React.Component {
  componentDidMount() {
    modelStore.loadNodeDetail(this.props.nodeId);
  }

  render() {
    const node = modelStore.nodeDetails
      .find(n => n.nodeId === this.props.nodeId);
    if (!node) {
      return null;
    }
    return <div>
      <div className="Two-col-wrapper">
        <ServerDetail node={node}/>
        <NetworkConnections connections={node.connections.connections}
          identifier={node.nodeId}
          nodes={node.connections.nodes}
          networkLocations={node.connections.networkLocations}
          environmentId={node.environment.environmentId}
          key={node.nodeId}/>
      </div>
    </div>;
  }
}

export default observer(Server);
