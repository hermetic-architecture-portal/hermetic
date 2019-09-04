import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import TechnologyDeploymentNode from './TechnologyDeploymentNode';

class TechnologyDeployment extends React.Component {
  componentDidMount() {
    modelStore.loadTechnologyDetail(this.props.technologyId);
    modelStore.loadTechnologyDeployment(this.props.technologyId);
  }

  render() {
    const tech = modelStore.technologyDetails
      .find(a => a.technologyId === this.props.technologyId);

    const techDeployment = modelStore.technologyComponentDeployments
      .find(a => a.technologyId === this.props.technologyId);

    if (!(tech && techDeployment)) {
      return null;
    }

    return <div>
      <div className="Single-col-wrapper">
        <div className="Head-1">
            {tech.name}
        </div>
        {techDeployment.deployments.map(d => <TechnologyDeploymentNode
          key={d.nodeId}
          technologyId={tech.technologyId}
          node={d}
        />)}
      </div>
    </div>;
  }
}

export default observer(TechnologyDeployment);
