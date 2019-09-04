import React from 'react'; // eslint-disable-line no-unused-vars
import Metric from './Metric';

class CategoryScore extends React.Component {
  render() {
    const { health, category } = this.props;
    const categoryScore = health.categoryScores.find(cs => cs.category === category);
    const metrics = health.metrics.filter(m => m.category === category);

    return <div>
      <div className="Technology-score Category-score">
        <div>{category}</div>
        <div className={`health-${categoryScore.band.levelNumber}-of-${health.maxLevelNumber}`}>
          {categoryScore.categoryScore}%
        </div>
      </div>
      <div className="Technology-metrics">
        {metrics.map(m => <Metric key={m.metricId}
          metric={m} maxLevelNumber={health.maxLevelNumber}/>)}
      </div>
    </div>;
  }
}

export default CategoryScore;
