import React from 'react'; // eslint-disable-line no-unused-vars
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import eaRefModelOverlayStore from '../../stores/eaRefModelOverlayStore';
import modelStore from '../../stores/modelStore';
import constants from '../../constants';

const EAArtifact = ({ artifact }) => {
  let className = 'EA-artifact';

  const showHealth = (
    eaRefModelOverlayStore.overlays.includes(constants.eaRefModelOverlays.eaHealth)
    && modelStore.eaMetricTotals.length
  );

  if (showHealth) {
    const health = modelStore.eaMetricTotals
      .find(t => t.eaArtifactId === artifact.eaArtifactId);
    if (health) {
      className = `${className} health-${health.band.levelNumber}-of-${health.maxLevelNumber}`;
    }
  }

  return <div className={className}>
    <Link
      to={`/eaArtifact/${artifact.eaArtifactId}`}>
      <div>
        {artifact.name}
      </div>
    </Link>
  </div>;
};

export default observer(EAArtifact);
