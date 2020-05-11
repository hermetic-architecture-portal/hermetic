import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import CostChart from './CostChart';

class CostModel extends React.Component {
  componentDidMount() {
    modelStore.loadTechnologies();
    modelStore.loadVendors();
    modelStore.loadTechnologyCosts();
  }

  render() {
    let contents;
    if (modelStore.technologyCosts.length
      && modelStore.technologies.length
      && modelStore.vendors.length) {
      contents = <React.Fragment>
        <CostChart />
      </React.Fragment>;
    }

    return <div className="Single-col-wrapper">
      <div className="Head-1">Cost Model</div>
      { contents }
    </div>;
  }
}

export default observer(CostModel);
