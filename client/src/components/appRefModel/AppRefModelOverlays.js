import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import constants from '../../constants';
import appRefModelOverlayStore from '../../stores/appRefModelOverlayStore';
import userStore from '../../stores/userStore';
import modelStore from '../../stores/modelStore';
import HealthLegend from '../shared/HealthLegend';
import TechnologyCategoryFilter from '../shared/TechnologyCategoryFilter';
import TechnologyTypeLegend from '../shared/TechnologyTypeLegend';

const checkboxChanged = (key, checked) => {
  if (checked) {
    appRefModelOverlayStore.addOverlay(constants.appRefModelOverlays[key]);
  } else {
    appRefModelOverlayStore.removeOverlay(constants.appRefModelOverlays[key]);
  }
};

const component = () => {
  const options = Object.keys(constants.appRefModelOverlays)
    .map((key) => {
      const canSee = userStore.data.allowedFeatures
        .includes(constants.appRefModelOverlayFeature[key]);
      if (!canSee) {
        return <label key={key}></label>;
      }
      return <label key={key}>
        {constants.appRefModelOverlays[key]}
        <input type="checkbox"
          checked={appRefModelOverlayStore.overlays.includes(constants.appRefModelOverlays[key])}
          onChange={event => checkboxChanged(key, event.target.checked)}/>
    </label>;
    });
  const legendItems = [];
  if (appRefModelOverlayStore.overlays.includes(constants.appRefModelOverlays.techHealth)) {
    legendItems.push(<HealthLegend key="techhl" className="ARM-legend"
      bands={modelStore.technologyHealthMetricTotalBands} title="Health"/>);
  }
  return <div className="Overlay-options">
    <TechnologyCategoryFilter
      technologyCategoryId={appRefModelOverlayStore.filters.technologyCategoryId}
      onCategoryChanged={(value) => {
        appRefModelOverlayStore.filters.technologyCategoryId = value;
      }} />
    Overlays:
    {options}
    <div className="Legend">
      <TechnologyTypeLegend baseClassName="ARM-technology" />
      {!legendItems.length ? undefined
        : <div>{legendItems}</div>}
    </div>
  </div>;
};

export default observer(component);
