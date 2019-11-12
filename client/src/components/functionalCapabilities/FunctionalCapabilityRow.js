import React from 'react'; // eslint-disable-line no-unused-vars
import { Link } from 'react-router-dom';

const component = ({ functionalCapability }) => {
  const technologiesJsx = functionalCapability.technologies
    .map(t => <Link key={`${functionalCapability.functionalCapabilityId}-${t.technologyId}`}
      to={`/technology/${t.technologyId}`}>
        <div>{t.name}</div>
    </Link>);

  if (technologiesJsx.length > 1) {
    const compareParams = functionalCapability.technologies
      .map(t => `technologyId=${t.technologyId}`)
      .join('&');
    technologiesJsx.push(<Link key="compare"
      to={`/compareTechnologies?${compareParams}`}>
      <div className='Functional-capability-compare'>Compare</div>
    </Link>);
  }

  return <div className="Functional-capability-row">
    <div>{functionalCapability.categoryName}</div>
    <div>
      <Link key={functionalCapability.functionalCapabilityId}
        to={`/functionalCapability/${functionalCapability.functionalCapabilityId}`}>
          {functionalCapability.name}
      </Link>
    </div>
    <div>
      {technologiesJsx}
    </div>
  </div>;
};

export default component;
