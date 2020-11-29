import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import ManagementDetailsText from './ManagementDetailsText';

class TechnologyManagementDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { environmentId: 'default' };
  }

  componentDidMount() {
    modelStore.loadTechnologyManagementDetail(this.props.technologyId);
  }

  render() {
    const tech = modelStore.technologyManagementDetails
      .find(a => a.technologyId === this.props.technologyId);
    if (!tech) {
      return null;
    }
    return <div>
      <div className="Two-col-wrapper">
        <ManagementDetailsText technology={tech} environmentId={this.state.environmentId}/>
      </div>
    </div>;
  }
}

export default observer(TechnologyManagementDetails);
