import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import { features } from 'hermetic-common';
import { Link } from 'react-router-dom';
import modelStore from '../../stores/modelStore';
import userStore from '../../stores/userStore';
import CompareTechHealthItem from './CompareTechHealthItem';

const component = ({
  technologyId, allFunctionalCapabilities, allHealthMetricsCategories, allHealthMetrics,
  compareTechnologiesStore,
}) => {
  const technology = modelStore.technologyDetails
    .find(td => td.technologyId === technologyId);
  let technicalJsx;
  let functionalCapabilitiesJsx;
  if (userStore.data.allowedFeatures.includes(features.techDetails)) {
    const technical = modelStore.technologyTechDetails
      .find(td => td.technologyId === technologyId);
    technicalJsx = <React.Fragment>
      <div></div>
      <div>{technical && technical.slaLevel}</div>
      <div>{technical && technical.disasterRecovery}</div>
      <div>{technical && technical.technologyType}</div>
      <div>{technical && technical.category}</div>
      <div>{technical && technical.lifecycleStatus}</div>
      <div>{technical && technical.standardLevel && technical.standardLevel.name}</div>
    </React.Fragment>;
    functionalCapabilitiesJsx = allFunctionalCapabilities
      .map((c) => {
        if (technical && technical.functionalCapabilities
          .some(tfc => tfc.functionalCapabilityId === c.functionalCapabilityId)) {
          return <div key={c.functionalCapabilityId}
            className="Compare-tech-capability-present">Y</div>;
        }
        return <div key={c.functionalCapabilityId}
          className="Compare-tech-capability-absent">N</div>;
      });
  }

  let healthJsx;
  if (userStore.data.allowedFeatures.includes(features.technologyHealthMetrics)) {
    const techHealth = modelStore.technologyHealthDetails
      .find(th => th.technologyId === technologyId);
    const metricItems = [];
    allHealthMetricsCategories.forEach((c) => {
      const categoryItem = techHealth && techHealth.categoryScores
        && techHealth.categoryScores.find(cs => cs.category === c);
      metricItems.push(<div key={`categoryItem-${c}`}>
        <CompareTechHealthItem
          maxLevelNumber={techHealth && techHealth.maxLevelNumber}
          score={categoryItem && categoryItem.categoryScore}
          band={categoryItem && categoryItem.band}/>
      </div>);
      allHealthMetrics
        .filter(m => m.category === c)
        .forEach((m) => {
          const metricItem = techHealth && techHealth.metrics
            && techHealth.metrics.find(tm => tm.metricId === m.metricId);
          metricItems.push(<div key={`metricItem-${m.metricId}`}>
            <CompareTechHealthItem
              maxLevelNumber={techHealth && techHealth.maxLevelNumber}
              score={metricItem && metricItem.percentScore}
              band={metricItem && metricItem.band}/>
          </div>);
        });
    });
    healthJsx = <React.Fragment>
      <div></div>
      <div>
        <CompareTechHealthItem
          maxLevelNumber={techHealth && techHealth.maxLevelNumber}
          score={techHealth && techHealth.totalScore}
          band={techHealth && techHealth.totalBand}/>
      </div>
      {metricItems}
    </React.Fragment>;
  }
  return <div className="Compare-tech-column">
    <div>
      <Link to={`/technology/${technology.technologyId}`}>
        {technology.name}
      </Link>
      <input type="button" value="x" className="Compare-tech-remove"
        onClick={() => compareTechnologiesStore.removeTechnology(technologyId)}/>
    </div>
    {technicalJsx}
    <div></div>
    {functionalCapabilitiesJsx}
    {healthJsx}
  </div>;
};

export default observer(component);
