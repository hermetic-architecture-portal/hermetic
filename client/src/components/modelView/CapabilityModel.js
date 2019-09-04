import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import CapabilityTypeWithValueChain from './CapabilityTypeWithValueChain';
import CapabilityType from './CapabilityType';
import CapabilityOverlays from './CapabilityOverlays';
import modelStore from '../../stores/modelStore';
import CapabilityOverlayStore from '../../stores/CapabilityOverlayStore';

class CapabilityModel extends React.Component {
  componentDidMount() {
    if (!this.props.capabilityTypes) {
      modelStore.loadCapabilityTypes();
    }
    modelStore.loadTechnologies();
  }

  render() {
    // when rendering on the main capability model we will load the full capability model
    // for ourselves
    // when rendering from a business unit page we will be passed a filtered capability model
    const capabilityTypes = this.props.capabilityTypes || modelStore.capabilityTypes;

    const capabilityOverlayStore = this.props.capabilityOverlayStore
      || CapabilityOverlayStore.mainView;

    const valueChainCapabilityTypes = capabilityTypes
      .filter(ct => ct.valueChains && ct.valueChains.length)
      .map(ct => <CapabilityTypeWithValueChain
        capabilityType={ct} key={ct.capabilityTypeId}
        capabilityOverlayStore={capabilityOverlayStore} />);

    const plainCapabilityTypes = capabilityTypes
      .filter(ct => !(ct.valueChains && ct.valueChains.length))
      .map(ct => <CapabilityType
        capabilityType={ct}
        key={ct.capabilityTypeId}
        capabilityOverlayStore={capabilityOverlayStore} />);

    return <div>
      <CapabilityOverlays capabilityOverlayStore={capabilityOverlayStore}/>
      {valueChainCapabilityTypes}
      {plainCapabilityTypes}
    </div>;
  }
}

export default observer(CapabilityModel);
