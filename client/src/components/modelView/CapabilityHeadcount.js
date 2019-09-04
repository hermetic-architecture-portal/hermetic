import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import constants from '../../constants';
import modelStore from '../../stores/modelStore';

const CapabilityHeadcount = ({ capabilityId, capabilityOverlayStore }) => {
  const showHeadcount = capabilityOverlayStore.overlays
    .includes(constants.capabilityOverlays.capabilityHeadcount);
  if (!showHeadcount) {
    return null;
  }

  const resourcing = modelStore.capabilityResourcing
    .find(r => r.capabilityId === capabilityId);

  if (!(resourcing && ('headcount' in resourcing))) {
    return null;
  }

  return <div className="Capability-model-tag">{resourcing.headcount}</div>;
};

export default observer(CapabilityHeadcount);
