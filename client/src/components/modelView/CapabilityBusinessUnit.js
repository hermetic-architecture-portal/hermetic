import React from 'react'; // eslint-disable-line no-unused-vars
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';

const component = ({ businessUnitName, businessUnitId }) => <Link
  to={`/businessUnit/${businessUnitId}`}>
    <div className='Capability-business-unit'>
      {businessUnitName}
    </div>
</Link>;

export default observer(component);
