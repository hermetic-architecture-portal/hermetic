import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import Health from '../shared/Health';

class TechnologyHealth extends React.Component {
  componentDidMount() {
    modelStore.loadTechnologyHealthDetail(this.props.technologyId);
  }

  render() {
    const tech = modelStore.technologyHealthDetails
      .find(a => a.technologyId === this.props.technologyId);
    if (!tech) {
      return null;
    }
    return <div className="Single-col-wrapper">
      <div className="Head-1">{tech.name}</div>
      <Health healthDetail={tech}/>
    </div>;
  }
}

export default observer(TechnologyHealth);
