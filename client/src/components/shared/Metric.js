import React from 'react'; // eslint-disable-line no-unused-vars

export default ({ metric, maxLevelNumber }) => <div className="Technology-metric">
  <div>{metric.name}</div>
  <div className={`health-${metric.band.levelNumber}-of-${maxLevelNumber}`}>
    {metric.percentScore}%
  </div>
  <div>{metric.description}</div>
</div>;
