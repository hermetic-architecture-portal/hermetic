import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import CategoryScore from './CategoryScore';

const Health = ({ healthDetail }) => {
  if (!healthDetail) {
    return null;
  }
  let categoryScores;
  if (healthDetail.categoryScores) {
    categoryScores = healthDetail.categoryScores.map(cs => <CategoryScore
      key={cs.category}
      health = {healthDetail}
      category={cs.category}
      />);
  }

  if (!healthDetail.categoryScores) {
    return <div>No health scores available for this item</div>;
  }
  return <div>
    <div className="Technology-score Technology-score-total">
      <div>Total Score:</div>
      <div className={`health-${healthDetail.totalBand.levelNumber}-of-${healthDetail.maxLevelNumber}`}>
        {healthDetail.totalScore}%
      </div>
    </div>
    {!categoryScores ? undefined : <div className="Head-3">Category Scores:</div>}
    {!categoryScores ? undefined : <div className="Category-scores">{categoryScores}</div>}
  </div>;
};


export default observer(Health);
