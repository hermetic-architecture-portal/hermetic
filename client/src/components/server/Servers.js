import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import modelStore from '../../stores/modelStore';
import SearchBox from '../shared/SearchBox';

class Servers extends React.Component {
  componentDidMount() {
    modelStore.loadNodes();
  }

  render() {
    let servers = <div></div>;
    if (modelStore.nodes.length) {
      const serverElements = modelStore.nodes
        .filter(n => (!(this.state && this.state.filter))
          || (n.name.toUpperCase().includes(this.state.filter.toUpperCase())))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(n => <Link key={n.nodeId} to={`/server/${n.nodeId}`}>
          <div data-server-type={n.nodeType} data-env-node={!n.isAbstractNode}>
            {n.name}
          </div>
        </Link>);
      servers = <div>
        <SearchBox
          valueChanged={value => this.setState({ filter: value })}/>
        {serverElements}
      </div>;
    }
    return <div>
      <div className="Single-col-wrapper">
        <div className="Head-1">Servers and Network Nodes</div>
        {servers}
      </div>
    </div>;
  }
}

export default observer(Servers);
