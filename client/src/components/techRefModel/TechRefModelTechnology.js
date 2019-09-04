import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import modelStore from '../../stores/modelStore';
import techRefModelOverlayStore from '../../stores/techRefModelOverlayStore';
import constants from '../../constants';
import SectionToggleWidget from '../shared/SectionToggleWidget';
import SectionVisibilityWrapper from '../shared/SectionVisibilityWrapper';

const TechRefModelTechnology = ({ technology }) => {
  let className = 'TRM-technology-wrapper';

  const showHealth = (
    techRefModelOverlayStore.overlays.includes(constants.techRefModelOverlays.technologyHealth)
    && modelStore.technologyHealthMetricTotals.length
  );

  if (showHealth) {
    const health = modelStore.technologyHealthMetricTotals
      .find(t => t.technologyId === technology.technologyId);
    if (health) {
      className = `${className} health-${health.band.levelNumber}-of-${health.maxLevelNumber}`;
    }
  }

  const childTechnologiesJsx = modelStore.technologies
    .filter(t => t.parentTechnologyId === technology.technologyId)
    .map(t => <TechRefModelTechnology technology={t}/>);

  const showStandard = techRefModelOverlayStore
    .overlays.includes(constants.techRefModelOverlays.standardAssessments)
    && modelStore.technicalStandardAssessments.length
    && modelStore.technicalStandardLevels.length;

  let standard;

  if (showStandard) {
    const assessment = modelStore.technicalStandardAssessments
      .find(t => t.technologyId === technology.technologyId);
    if (assessment && assessment.standardLevelId) {
      const maxStandardLevel = modelStore.technicalStandardLevels
        .reduce((previous, current) => {
          if (current.levelNumber > previous) {
            return current.levelNumber;
          }
          return previous;
        }, 0);
      const level = modelStore.technicalStandardLevels
        .find(l => l.levelId === assessment.standardLevelId);
      standard = <div className={`TRM-tag health-${level.levelNumber}-of-${maxStandardLevel}`}>
      </div>;
    }
  }
  return <div className={className}>
      <SectionToggleWidget sectionName={technology.technologyId}
        sectionType="technologyChildren" hasChildren={!!childTechnologiesJsx.length}/>
      <Link to={`/technology/${technology.technologyId}`}>
        <div className="TRM-technology">
          {standard}
          {technology.name}
        </div>
      </Link>
      <SectionVisibilityWrapper sectionName={technology.technologyId}
        sectionType="technologyChildren">
        <div className="TRM-children">
          {childTechnologiesJsx}
        </div>
      </SectionVisibilityWrapper>
    </div>;
};

export default observer(TechRefModelTechnology);
