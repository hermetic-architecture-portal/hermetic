import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import CapabilityModel from '../modelView/CapabilityModel';
import CapabilityOverlayStore from '../../stores/CapabilityOverlayStore';
import Links from '../shared/Links';

class BusinessUnit extends React.Component {
  componentDidMount() {
    modelStore.loadBusinessUnitDetail(this.props.businessUnitId);
  }

  render() {
    const bu = modelStore.businessUnitDetails
      .find(b => b.businessUnitId === this.props.businessUnitId);
    if (!bu) {
      return null;
    }
    const capabilityOverlayStore = new CapabilityOverlayStore(4);
    return <div>
      <div className="Single-col-wrapper">
        <div className="Head-1">{bu.name}</div>
        { !bu.description ? undefined
          : <div className="Data-single-row">{bu.description}</div>}
        <Links links={bu.links} />
      </div>
      <CapabilityModel capabilityTypes={bu.capabilityTypes}
        capabilityOverlayStore={capabilityOverlayStore}/>
    </div>;
  }
}

export default observer(BusinessUnit);
