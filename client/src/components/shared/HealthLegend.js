import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';

const HealthLegend = ({ bands, title, className }) => {
  const maxLevelNumber = bands
    .reduce((runningMax, current) => (
      current.levelNumber > runningMax ? current.levelNumber : runningMax
    ), 0);
  const legendItems = bands
    .sort((a, b) => b.levelNumber - a.levelNumber)
    .map(b => <div key={b.levelNumber} className={`Health-legend-item health-${b.levelNumber}-of-${maxLevelNumber}`}>{b.name}</div>);
  return <div className={className}>
    <div>{title}:</div>
    {legendItems}
    <div className="Health-legend-item no-assessment">Not Assessed</div>
  </div>;
};

export default observer(HealthLegend);
