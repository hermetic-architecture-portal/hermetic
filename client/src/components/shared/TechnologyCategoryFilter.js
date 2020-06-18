import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import modelStore from '../../stores/modelStore';

class TechnologyCategoryFilter extends React.Component {
  constructor(props) {
    super(props);
    this.filters = observable({
      technologyCategoryId: this.props.defaultCategory,
    });
    this.categoryChanged = this.categoryChanged.bind(this);
  }

  componentDidMount() {
    modelStore.loadTechnologyCategories();
  }

  categoryChanged(event) {
    this.props.onCategoryChanged(event.target.value);
  }

  render() {
    const categoryOptions = modelStore.technologyCategories.map(c => <option
      value={c.technologyCategoryId} key={c.technologyCategoryId}>
      {c.name}
    </option>);

    return <div className="Category-filter">
      <label>
        Category:
        <select value={this.props.technologyCategoryId}
          onChange={this.categoryChanged}>
          <option value="any">Any</option>
          {categoryOptions}
        </select>
      </label>
    </div>;
  }
}

export default observer(TechnologyCategoryFilter);
