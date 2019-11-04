import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import constants from '../../constants';
import techRefModelOverlayStore from '../../stores/techRefModelOverlayStore';
import userStore from '../../stores/userStore';
import modelStore from '../../stores/modelStore';
import HealthLegend from '../shared/HealthLegend';

const checkboxChanged = (key, checked) => {
  if (checked) {
    techRefModelOverlayStore.addOverlay(constants.techRefModelOverlays[key]);
  } else {
    techRefModelOverlayStore.removeOverlay(constants.techRefModelOverlays[key]);
  }
};

const getOption = (key, title) => {
  const canSee = userStore.data.allowedFeatures
    .includes(constants.techRefModelOverlayFeature[key])
  && (
    // can only have technology health overlay if already have technology overlay
    (constants.techRefModelOverlays[key] !== constants.techRefModelOverlays.technologyHealth)
    || techRefModelOverlayStore.overlays.includes(constants.techRefModelOverlays.technologies)
  )
  && (
    // can only have standard assessments overlay if already have technology overlay
    (constants.techRefModelOverlays[key] !== constants.techRefModelOverlays.standardAssessments)
    || techRefModelOverlayStore.overlays.includes(constants.techRefModelOverlays.technologies)
  );
  if (!canSee) {
    return <label></label>;
  }
  return <label>
    {title}
    <input type="checkbox"
      checked={techRefModelOverlayStore.overlays.includes(constants.techRefModelOverlays[key])}
      onChange={event => checkboxChanged(key, event.target.checked)}/>
</label>;
};

const component = () => {
  let functionalCapabilityOptions;

  if (userStore.data.allowedFeatures
    .includes(
      constants.techRefModelOverlayFeature[constants.techRefModelOverlays.functionalCapabilities],
    )) {
    functionalCapabilityOptions = <div className="Overlay-option-group">
      <div className="Group-name">Functional Capabilities:</div>
      <div className="Group-options">
        {getOption(constants.techRefModelOverlays.functionalCapabilities, 'Show')}
      </div>
    </div>;
  }

  const legendItems = [];
  if (techRefModelOverlayStore.overlays.includes(constants.techRefModelOverlays.technologyHealth)) {
    legendItems.push(<HealthLegend key="ahl" className="TRM-legend"
      bands={modelStore.technologyHealthMetricTotalBands} title="Technology Health"/>);
  }
  if (techRefModelOverlayStore.overlays
    .includes(constants.techRefModelOverlays.standardAssessments)) {
    let levels;
    if (!modelStore.technicalStandardLevels.length) {
      levels = <div className="Standard-legend-item">No data available</div>;
    } else {
      const maxStandardLevel = modelStore.technicalStandardLevels
        .reduce((previous, current) => {
          if (current.levelNumber > previous) {
            return current.levelNumber;
          }
          return previous;
        }, 0);
      levels = modelStore.technicalStandardLevels
        .sort((a, b) => a.levelNumber - b.levelNumber)
        .map(l => <div className="Standard-legend-item">
          {l.name}
          <div className={`TRM-tag health-${l.levelNumber}-of-${maxStandardLevel}`}></div>
        </div>);
    }

    const legend = <div className="Standard-legend">
      <div>Standard Assessments:</div>
      {levels}
    </div>;
    legendItems.push(legend);
  }
  return <div className="Overlay-options">
    <div className="Overlay-option-group">
      <div className="Group-name">Technologies:</div>
      <div className="Group-options">
        {getOption(constants.techRefModelOverlays.technologies, 'Show')}
        {getOption(constants.techRefModelOverlays.technologyHealth, 'Show Health')}
        {getOption(constants.techRefModelOverlays.standardAssessments, 'Show Standard Assessments')}
      </div>
    </div>
    {functionalCapabilityOptions}
    {!legendItems.length ? undefined
      : <div className="Legend">{legendItems}</div>}
  </div>;
};

export default observer(component);
