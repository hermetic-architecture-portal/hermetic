import React from 'react'; // eslint-disable-line no-unused-vars
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import TechnologyConnections from './TechnologyConnections';
import SearchBox from '../shared/SearchBox';

class Technologies extends React.Component {
  componentDidMount() {
    modelStore.loadTechnologies();
  }

  render() {
    const technologies = modelStore.technologies
      .filter(a => (!(this.state && this.state.filter))
        || (a.name.toUpperCase().includes(this.state.filter.toUpperCase())));
    return <div>
      <div className="Two-col-wrapper">
        <div className="Left-col">
          <div className="Head-1">Technologies</div>
          <SearchBox valueChanged={value => this.setState({ filter: value })}/>
          {technologies.map(tech => (
            <Link key={tech.technologyId} to={`/technology/${tech.technologyId}`}>
              <div>{tech.name}</div>
            </Link>
          ))}
        </div>
        <TechnologyConnections
          connections={modelStore.dataConnections}
          technologies={modelStore.technologies}
          key={modelStore.dataConnections.length} />
      </div>
    </div>;
  }
}

export default observer(Technologies);
