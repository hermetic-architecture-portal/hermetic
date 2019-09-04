import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import constants from '../../constants';
import eaRefModelOverlayStore from '../../stores/eaRefModelOverlayStore';
import userStore from '../../stores/userStore';
import modelStore from '../../stores/modelStore';
import HealthLegend from '../shared/HealthLegend';

const checkboxChanged = (key, checked) => {
  if (checked) {
    eaRefModelOverlayStore.addOverlay(constants.eaRefModelOverlays[key]);
  } else {
    eaRefModelOverlayStore.removeOverlay(constants.eaRefModelOverlays[key]);
  }
};

const component = () => {
  const options = Object.keys(constants.eaRefModelOverlays)
    .map((key) => {
      const canSee = userStore.data.allowedFeatures
        .includes(constants.eaRefModelOverlayFeature[key]);
      if (!canSee) {
        return <label key={key}></label>;
      }
      return <label key={key}>
        {constants.eaRefModelOverlays[key]}
        <input type="checkbox"
          checked={eaRefModelOverlayStore.overlays.includes(constants.eaRefModelOverlays[key])}
          onChange={event => checkboxChanged(key, event.target.checked)}/>
    </label>;
    });
  const legendItems = [];
  if (eaRefModelOverlayStore.overlays.includes(constants.eaRefModelOverlays.eaHealth)) {
    legendItems.push(<HealthLegend key="eahl" className="EA-ref-model-legend"
      bands={modelStore.eaMetricTotalBands} title="Health"/>);
  }
  return <div className="Overlay-options">
    <div>Overlays:</div>
    {options}
    {!legendItems.length ? undefined
      : <div className="Legend">{legendItems}</div>}
  </div>;
};

export default observer(component);
