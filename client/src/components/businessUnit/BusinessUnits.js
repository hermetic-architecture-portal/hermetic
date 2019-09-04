import React from 'react'; // eslint-disable-line no-unused-vars
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import SearchBox from '../shared/SearchBox';

class BusinessUnits extends React.Component {
  componentDidMount() {
    modelStore.loadBusinessUnits();
  }

  render() {
    const businessUnits = modelStore.businessUnits
      .filter(a => (!(this.state && this.state.filter))
      || (a.name.toUpperCase().includes(this.state.filter.toUpperCase())));
    return <div className="Single-col-wrapper">
      <div className="Head-1">Business Units</div>
      <SearchBox valueChanged={value => this.setState({ filter: value })}/>
      {businessUnits.map(bu => (
        <Link key={bu.businessUnitId} to={`/businessUnit/${bu.businessUnitId}`}>
          <div>{bu.name}</div>
        </Link>
      ))}
    </div>;
  }
}

export default observer(BusinessUnits);
