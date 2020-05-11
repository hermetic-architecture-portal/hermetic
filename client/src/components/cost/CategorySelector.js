import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import costModelFilterStore from '../../stores/costModelFilterStore';

const checkboxChanged = (c) => {
  if (costModelFilterStore.excludedCategories.includes(c)) {
    costModelFilterStore.excludedCategories.remove(c);
  } else {
    costModelFilterStore.excludedCategories.push(c);
  }
};

const CategorySelector = ({ categories }) => <div className="Overlay-option-group">
  <div className="Group-name">Categories</div>
  <div className="Group-options">{
    categories
      .map(c => <label key={c}>
        {c}
        <input type="checkbox"
          checked={!costModelFilterStore.excludedCategories.includes(c)}
          onChange={() => checkboxChanged(c)}/>
    </label>)}
  </div>
</div>;

export default observer(CategorySelector);
