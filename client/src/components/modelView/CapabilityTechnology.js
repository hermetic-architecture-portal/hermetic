import React from 'react'; // eslint-disable-line no-unused-vars
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import constants from '../../constants';
import modelStore from '../../stores/modelStore';

const component = ({
  technologyName, technologyId, technologyType, capabilityOverlayStore,
}) => {
  const technologyTypeClassName = !technologyType ? 'TechnologyType-Unknown'
    : `TechnologyType-${technologyType.replace(' ', '').replace('/', '-')}`;

  let className = `Capability-technology ${technologyTypeClassName}`;

  const showHealth = (
    capabilityOverlayStore.overlays.includes(constants.capabilityOverlays.technologyHealth)
    && modelStore.technologyHealthMetricTotals.length
  );

  if (showHealth) {
    const health = modelStore.technologyHealthMetricTotals
      .find(h => h.technologyId === technologyId);
    if (health) {
      className = `${className} health-${health.band.levelNumber}-of-${health.maxLevelNumber}`;
    }
  }

  return <Link to={`/technology/${technologyId}`}>
      <div className={className}>
        {technologyName}
      </div>
  </Link>;
};

export default observer(component);
