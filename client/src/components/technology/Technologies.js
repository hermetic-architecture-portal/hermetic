import React from 'react'; // eslint-disable-line no-unused-vars
import { Link } from 'react-router-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import TechnologyConnections from './TechnologyConnections';
import SearchBox from '../shared/SearchBox';
import TechnologyCategoryFilter from '../shared/TechnologyCategoryFilter';

class Technologies extends React.Component {
  constructor(props) {
    super(props);
    this.filters = observable({
      technologyCategoryId: 'any',
      search: '',
    });
  }

  componentDidMount() {
    modelStore.loadTechnologies();
  }

  render() {
    const technologies = modelStore.technologies
      .filter(a => (!this.filters.search)
        || (a.name.toUpperCase().includes(this.filters.search.toUpperCase())))
      .filter(a => (this.filters.technologyCategoryId === 'any')
        || (a.technologyCategoryId === this.filters.technologyCategoryId));
    return <div>
      <div className="Two-col-wrapper">
        <div className="Left-col">
          <div className="Head-1">Technologies</div>
          <div className="Technology-filters">
            <TechnologyCategoryFilter technologyCategoryId={this.filters.technologyCategoryId}
              onCategoryChanged={(value) => { this.filters.technologyCategoryId = value; }} />
            <SearchBox valueChanged={(value) => { this.filters.search = value; }}/>
          </div>
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
