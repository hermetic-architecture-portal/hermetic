import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import ComponentDiagram from './ComponentDiagram';

class TechnologyComponents extends React.Component {
  componentDidMount() {
    modelStore.loadTechnologyDetail(this.props.technologyId);
    modelStore.loadTechnologyComponents(this.props.technologyId);
  }

  render() {
    const tech = modelStore.technologyDetails
      .find(a => a.technologyId === this.props.technologyId);

    const techComponents = modelStore.technologyComponents
      .find(a => a.technologyId === this.props.technologyId);

    if (!(tech && techComponents)) {
      return null;
    }
    return <div>
      <div className="Single-col-wrapper">
        <ComponentDiagram technology={tech} components={techComponents.components}
          connections={techComponents.connections}
          key={techComponents.components.length}/>
      </div>
    </div>;
  }
}

export default observer(TechnologyComponents);
