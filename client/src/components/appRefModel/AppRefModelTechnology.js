import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import modelStore from '../../stores/modelStore';
import appRefModelOverlayStore from '../../stores/appRefModelOverlayStore';
import constants from '../../constants';


const AppRefModelTechnology = ({ technology }) => {
  let className = 'ARM-technology';

  const showHealth = (
    appRefModelOverlayStore.overlays.includes(constants.appRefModelOverlays.techHealth)
    && modelStore.technologyHealthMetricTotals.length
  );

  if (showHealth) {
    const health = modelStore.technologyHealthMetricTotals
      .find(t => t.technologyId === technology.technologyId);
    if (health) {
      className = `${className} health-${health.band.levelNumber}-of-${health.maxLevelNumber}`;
    }
  }

  return <div className={className}>
      <Link to={`/technology/${technology.technologyId}`}>
        <div>
          {technology.name}
        </div>
      </Link>
    </div>;
};

export default observer(AppRefModelTechnology);
