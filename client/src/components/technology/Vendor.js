import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import modelStore from '../../stores/modelStore';

class Vendor extends React.Component {
  componentDidMount() {
    modelStore.loadVendorDetail(this.props.vendorId);
  }

  render() {
    const vendor = modelStore.vendorDetails
      .find(v => v.vendorId === this.props.vendorId);
    if (!vendor) {
      return null;
    }
    const technologies = vendor.technologies
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(t => <li>
      <Link to={`/technology/${t.technologyId}`}>
        {t.name}
      </Link>
    </li>);
    return <div>
      <div className="Single-col-wrapper">
        <div className="Head-1">{vendor.name}</div>
        <div className="Data-row">
          <div>Technologies</div>
          <div>
            <ul>
              {technologies}
            </ul>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default observer(Vendor);
