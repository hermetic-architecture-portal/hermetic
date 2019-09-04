import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import constants from '../../constants';
import userStore from '../../stores/userStore';
import TechnologyTypeLegend from './TechnologyTypeLegend';
import HealthLegend from '../shared/HealthLegend';
import modelStore from '../../stores/modelStore';

const checkboxChanged = (key, checked, capabilityOverlayStore) => {
  if (checked) {
    capabilityOverlayStore.addOverlay(constants.capabilityOverlays[key]);
  } else {
    capabilityOverlayStore.removeOverlay(constants.capabilityOverlays[key]);
  }
};

const getOption = (key, title, capabilityOverlayStore) => {
  const canSee = userStore.data.allowedFeatures
    .includes(constants.capabilityOverlayFeature[key])
  && (
    // can only have technology health overlay if already have technology overlay
    (constants.capabilityOverlays[key] !== constants.capabilityOverlays.technologyHealth)
    || capabilityOverlayStore.overlays.includes(constants.capabilityOverlays.technologies)
  );
  if (!canSee) {
    return <label></label>;
  }
  return <label>
    {title}
    <input type="checkbox"
      checked={capabilityOverlayStore.overlays.includes(constants.capabilityOverlays[key])}
      onChange={event => checkboxChanged(key, event.target.checked, capabilityOverlayStore)}/>
</label>;
};

const component = ({ capabilityOverlayStore }) => {
  const legendItems = [];
  if (capabilityOverlayStore.overlays.includes(constants.capabilityOverlays.technologies)) {
    legendItems.push(<TechnologyTypeLegend key="atl"/>);
  }
  if (capabilityOverlayStore.overlays.includes(constants.capabilityOverlays.technologyHealth)) {
    legendItems.push(<HealthLegend key="ahl" className="BRM-tech-health-legend"
      bands={modelStore.technologyHealthMetricTotalBands} title="Technology Health"/>);
  }
  if (capabilityOverlayStore.overlays.includes(constants.capabilityOverlays.capabilityHealth)) {
    legendItems.push(<HealthLegend key="chl" className="BRM-capability-health-legend"
      bands={modelStore.capabilityHealthMetricTotalBands} title="Capability Health"/>);
  }
  return <div className="Overlay-options">
    <div className="Overlay-option-group">
      <div className="Group-name">Technologies:</div>
      <div className="Group-options">
        {getOption(constants.capabilityOverlays.technologies, 'Show', capabilityOverlayStore)}
        {getOption(constants.capabilityOverlays.technologyHealth,
          'Show Health', capabilityOverlayStore)}
      </div>
    </div>
    <div className="Overlay-option-group">
      <div className="Group-name">Business Units:</div>
      <div className="Group-options">
        {getOption(constants.capabilityOverlays.businessUnits, 'Show', capabilityOverlayStore)}
      </div>
    </div>
    <div className="Overlay-option-group">
      <div className="Group-name">Capabilities:</div>
      <div className="Group-options">
        {getOption(constants.capabilityOverlays.capabilityHealth,
          'Show Health', capabilityOverlayStore)}
        {getOption(constants.capabilityOverlays.capabilityHeadcount,
          'Show Headcount', capabilityOverlayStore)}
        <label>
          Expand Levels:
          <input type="number"
            value={capabilityOverlayStore.capabilityLevel.max}
            max={4}
            min={1}
            onChange={(event) => {
              capabilityOverlayStore.setCapabilityLevel(event.target.value);
            }}/>
        </label>
      </div>
    </div>
    {!legendItems.length ? undefined
      : <div className="Legend">{legendItems}</div>}
  </div>;
};

export default observer(component);
