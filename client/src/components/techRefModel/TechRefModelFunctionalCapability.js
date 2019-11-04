import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

const TechRefModelTechnology = ({ functionalCapability }) => <div
  className="TRM-functional-capability-wrapper">
  <Link to={`/functionalCapability/${functionalCapability.functionalCapabilityId}`}>
    <div className="TRM-functional-capability">
      {functionalCapability.name}
    </div>
  </Link>
</div>;

export default observer(TechRefModelTechnology);
