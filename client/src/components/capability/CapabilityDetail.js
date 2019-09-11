import React from 'react'; // eslint-disable-line no-unused-vars
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import userStore from '../../stores/userStore';
import constants from '../../constants';
import Health from '../shared/Health';
import Links from '../shared/Links';
import CapabilityModel from '../modelView/CapabilityModel';
import CapabilityOverlayStore from '../../stores/CapabilityOverlayStore';

class CapabilityDetail extends React.Component {
  async componentDidMount() {
    // don't need to await loadCapabilityDetail, it can finish whenever
    modelStore.loadCapabilityDetail(this.props.capabilityId);
    // check if we can show health details to this user
    if (userStore.data.allowedFeatures
      .includes(constants.capabilityOverlayFeature.capabilityHealth)) {
      // don't need to await this, can finish whenever
      modelStore.loadCapabilityHealthDetail(this.props.capabilityId);
    }
    if (userStore.data.allowedFeatures
      .includes(constants.capabilityOverlayFeature.capabilityHeadcount)) {
      // don't need to await this, can finish whenever
      modelStore.loadCapabilityResourcing();
    }
  }

  render() {
    const { capabilityId } = this.props;
    const capability = modelStore.capabilityDetails.find(m => m.capabilityId === capabilityId);
    if (!capability) {
      return null;
    }

    const capabilityOverlayStore = new CapabilityOverlayStore(99);

    let capabilityModel;

    if (capability.capabilityModel && (capability.capabilityModel.length > 1)) {
      const capabilityTypes = [
        {
          capabilityTypeId: 1,
          name: 'Child',
          capabilities: capability.capabilityModel
            .map(c => ({
              capabilityId: c.capabilityId,
              capabilityTypeId: 1,
              parentCapabilityId: (capabilityId === c.capabilityId)
                ? undefined : c.parentCapabilityId,
              name: c.name,
            })),
        },
      ];
      capabilityModel = <CapabilityModel capabilityTypes={capabilityTypes}
      capabilityOverlayStore={capabilityOverlayStore}/>;
    }

    const capResourcing = modelStore.capabilityResourcing
      .find(r => r.capabilityId === capabilityId);

    const capHealth = modelStore.capabilityHealthDetails
      .find(h => h.capabilityId === capabilityId);

    const childCapabilitiesJsx = capability.childCapabilities.map(child => (
      <li key={child.capabilityId}>
        <Link to={`/capability/${child.capabilityId}`}>
          {child.name}
        </Link>
      </li>
    ));

    const technologiesJsx = capability.technologies.map(tech => (
      <li key={tech.technologyId}>
        <Link to={`/technology/${tech.technologyId}`}>
          {tech.name}
        </Link>
      </li>
    ));
    return <div className="Capability-detail">
        <div className="Single-col-wrapper">
        <div className="Head-1">{capability.name}</div>
        { !capability.description ? undefined
          : <div className="Data-single-row">{capability.description}</div>}
        <Links links={capability.links} />
        { !(capResourcing && ('headcount' in capResourcing)) ? undefined
          : <div className="Data-row">
          <div>Headcount</div>
          <div>{capResourcing.headcount}</div>
          </div>}
        { !capability.parentCapability ? undefined
          : <div className="Data-row">
            <div>Parent Capability</div>
            <div>
              <Link to={`/capability/${capability.parentCapability.capabilityId}`}>
                {capability.parentCapability.name}
              </Link>
            </div>
          </div>}
        { !childCapabilitiesJsx.length ? undefined
          : <div className="Data-row">
              <div>Child Capabilities</div>
              <div>
                <ul>
                  {childCapabilitiesJsx}
                </ul>
              </div>
            </div>}
        { !technologiesJsx.length ? undefined
          : <div className="Data-row">
              <div>Related Technologies</div>
              <div>
                <ul>
                  {technologiesJsx}
                </ul>
              </div>
            </div>}
        { !capHealth ? undefined
          : <div className="Data-block">
              <div className="Head-2">Health Assessment</div>
              <Health healthDetail={capHealth}/>
            </div>}
      </div>
      {capabilityModel}
    </div>;
  }
}

export default observer(CapabilityDetail);
