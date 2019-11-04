import React from 'react'; // eslint-disable-line no-unused-vars

const component = ({ maxLevelNumber, score, band }) => {
  if (!maxLevelNumber) {
    return null;
  }
  const className = `Compare-tech-health-item health-${band.levelNumber}-of-${maxLevelNumber}`;
  return <div className={className}>{score}%</div>;
};

export default component;
