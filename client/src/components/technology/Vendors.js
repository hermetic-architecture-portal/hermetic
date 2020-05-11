import React from 'react'; // eslint-disable-line no-unused-vars
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import SearchBox from '../shared/SearchBox';

class Vendors extends React.Component {
  componentDidMount() {
    modelStore.loadVendors();
  }

  render() {
    const vendors = modelStore.vendors
      .filter(a => (!(this.state && this.state.filter))
      || (a.name.toUpperCase().includes(this.state.filter.toUpperCase())))
      .sort((a, b) => a.name.localeCompare(b.name));
    return <div className="Single-col-wrapper">
      <div className="Head-1">Vendors</div>
      <SearchBox valueChanged={value => this.setState({ filter: value })}/>
      {vendors.map(v => (
        <Link key={v.vendorId} to={`/vendor/${v.vendorId}`}>
          <div>{v.name}</div>
        </Link>
      ))}
    </div>;
  }
}

export default observer(Vendors);
