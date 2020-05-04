import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import costModelFilterStore from '../../stores/costModelFilterStore';

const changeYearFrom = (event) => {
  if (event.target.value <= costModelFilterStore.yearTo) {
    costModelFilterStore.yearFrom = event.target.value;
  }
};

const changeYearTo = (event) => {
  if (event.target.value >= costModelFilterStore.yearFrom) {
    costModelFilterStore.yearTo = event.target.value;
  }
};

const YearSelector = ({ costs }) => {
  const minYear = costs.reduce((min, current) => (current.year < min ? current.year : min), 9999);
  const maxYear = costs.reduce((max, current) => (current.year > max ? current.year : max), 0);
  let { yearFrom, yearTo } = costModelFilterStore;
  if ((yearFrom < minYear) || (yearFrom > maxYear)) {
    yearFrom = minYear;
  }
  if ((yearTo < minYear) || (yearTo > maxYear)) {
    yearTo = maxYear;
  }
  const yearOptions = [];
  for (let i = minYear; i <= maxYear; i += 1) {
    yearOptions.push(<option key={i} value={i}>{i}</option>);
  }
  return <div className="Overlay-option-group">
    <div className="Group-name">Years</div>
    <div className="Group-options">
      <select value={yearFrom}
        onChange={changeYearFrom} >
        {yearOptions}
      </select>
      To
      <select value={yearTo}
        onChange={changeYearTo} >
        {yearOptions}
      </select>
    </div>
  </div>;
};

export default observer(YearSelector);
