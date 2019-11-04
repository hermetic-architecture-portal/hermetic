import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { features } from 'hermetic-common';
import userStore from '../../stores/userStore';

const component = ({ allFunctionalCapabilities, allHealthMetricsCategories, allHealthMetrics }) => {
  let technicalJsx;
  if (userStore.data.allowedFeatures.includes(features.techDetails)) {
    technicalJsx = <React.Fragment>
      <div className="Compare-tech-group-name">General</div>
      <div>SLA Level</div>
      <div>Disaster Recovery</div>
      <div>Technology Type</div>
      <div>Category</div>
      <div>Lifecycle Status</div>
      <div>Standard Level</div>
    </React.Fragment>;
  }
  let healthJsx;
  if (userStore.data.allowedFeatures.includes(features.technologyHealthMetrics)) {
    const metricsJsx = [];
    allHealthMetricsCategories.forEach((c) => {
      metricsJsx.push(<div key={`category-${c}`}>{c}</div>);
      metricsJsx.push(...allHealthMetrics
        .filter(m => m.category === c)
        .map(m => <div className="Compare-tech-sub-group-item"
          key={m.metricId}>
          {m.name}
        </div>));
    });

    healthJsx = <React.Fragment>
      <div className="Compare-tech-group-name">Health</div>
      <div>Total Score</div>
      {metricsJsx}
    </React.Fragment>;
  }
  const functionalCapabilitiesJsx = allFunctionalCapabilities
    .map(c => <div key={c.functionalCapabilityId} >
      <Link to={`/functionalCapability/${c.functionalCapabilityId}`}>
        {c.name}
      </Link>
    </div>);
  return <div className="Compare-tech-column">
    <div>Technology</div>
    {technicalJsx}
    <div className="Compare-tech-group-name">Functional Capabilities</div>
    {functionalCapabilitiesJsx}
    {healthJsx}
  </div>;
};

export default observer(component);
