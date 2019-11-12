import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import SearchBox from '../shared/SearchBox';
import FunctionalCapabilityRow from './FunctionalCapabilityRow';

class FunctionalCapabilities extends React.Component {
  componentDidMount() {
    modelStore.loadFunctionalCapabilities();
  }

  render() {
    let capabilities = <div></div>;
    if (modelStore.functionalCapabilities.length) {
      const capabilityElements = modelStore.functionalCapabilities
        .filter(c => (!(this.state && this.state.filter))
          || c.name.toUpperCase().includes(this.state.filter.toUpperCase())
          || (c.categoryName || '').toUpperCase().includes(this.state.filter.toUpperCase()))
        .sort((a, b) => `${a.categoryName}.${a.name}`
          .localeCompare(`${b.categoryName}.${b.name}`))
        .map(c => <FunctionalCapabilityRow
          functionalCapability={c} key={c.functionalCapabilityId} />);
      capabilities = <div>
        {capabilityElements}
      </div>;
    }
    return <div>
      <div className="Functional-capabilities-wrapper">
        <div className="Head-1">Functional Capabilities</div>
        <SearchBox
          valueChanged={value => this.setState({ filter: value })}/>
        <div className="Functional-capability-row Functional-capability-heading">
          <div>Category</div>
          <div>Functional Capability</div>
          <div>Technologies</div>
        </div>
        {capabilities}
      </div>
    </div>;
  }
}

export default observer(FunctionalCapabilities);
