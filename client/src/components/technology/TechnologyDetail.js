import React from 'react'; // eslint-disable-line no-unused-vars
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { features } from 'hermetic-common';
import userStore from '../../stores/userStore';
import ExtensionFields from '../shared/ExtensionFields';
import Links from '../shared/Links';

const component = ({ technology }) => {
  const links = [];
  if (userStore.data.allowedFeatures.includes(features.techDetails)) {
    links.push(<li key="technical">
      <Link to={`/technology/${technology.technologyId}/technical`}>
        Technical
      </Link>
    </li>);
    links.push(<li key="components">
      <Link to={`/technology/${technology.technologyId}/components`}>
        Components
      </Link>
    </li>);
    links.push(<li key="deployment">
      <Link to={`/technology/${technology.technologyId}/deployment`}>
        Deployment
      </Link>
    </li>);
    links.push(<li key="compare">
      <Link to={`/compareTechnologies?technologyId=${technology.technologyId}`}>
        Compare
      </Link>
    </li>);
  }
  if (userStore.data.allowedFeatures.includes(features.technologyHealthMetrics)) {
    links.push(<li key="health">
      <Link to={`/technology/${technology.technologyId}/health`}>
        Health
      </Link>
    </li>);
  }
  let lastReviewed = 'Not recorded';
  if (technology.lastReviewedOn) {
    lastReviewed = `${technology.lastReviewedOn} `;
    if (technology.lastReviewedBy) {
      lastReviewed = `${lastReviewed} by ${technology.lastReviewedBy}`;
    }
  } else if (technology.lastReviewedBy) {
    lastReviewed = `by ${technology.lastReviewedBy}`;
  }

  const childTechnologiesJsx = technology.childTechnologies.map(child => (
    <li key={child.technologyId}>
      <Link to={`/technology/${child.technologyId}`}>
        {child.name}
      </Link>
    </li>
  ));

  const dataEntitiesJsx = technology.dataEntities
    .sort((a, b) => a.role.rank - b.role.rank)
    .map((d) => {
      const className = (d.role.rank === 1) ? 'Data-access-owner' : undefined;
      return <tr className={className} key={d.dataEntityId}>
        <td>{d.role.name}</td>
        <td>
          <Link to={`/entity/${d.dataEntityId}`}>
            {d.dataEntityName}
          </Link>
        </td>
        <td>{d.description}</td>
      </tr>;
    });

  return <div className="Left-col">
    <div className="Head-1">{technology.name}</div>
    {!technology.aka ? undefined : <div className="Head-2">Aka {technology.aka}</div>}
    {!links.length ? undefined : <div className="Data-row">
      <div>Details</div>
      <div><ul>{links}</ul></div>
    </div>}
    <div className="Data-row">
      <div>Main Purpose</div>
      <div>{technology.purpose}</div>
    </div>
    <div className="Data-row">
      <div>Business Owner</div>
      <div>{technology.businessOwner ? technology.businessOwner : 'Unknown'}</div>
    </div>
    <div className="Data-row">
      <div>Last Reviewed</div>
      <div>{lastReviewed}</div>
    </div>
    <div className="Data-row">
      <div>GDPR Assessed</div>
      <div>{(typeof technology.gdprAssessed === 'undefined')
        ? 'Unknown' : technology.gdprAssessed}</div>
    </div>
    <div className="Data-row">
      <div>Private Data</div>
      <div>{(typeof technology.hasPrivateData === 'undefined')
        ? 'Unknown' : technology.hasPrivateData}</div>
    </div>
    { technology.technologyType !== 'SaaS' ? undefined
      : <div className="Data-row">
      <div>Cloud Risk Assessed</div>
      <div>{(typeof technology.cloudRiskAssessed === 'undefined')
        ? 'Unknown' : technology.cloudRiskAssessed}</div>
    </div>}
    <ExtensionFields entity={technology} />
    { !technology.parentTechnology ? undefined
      : <div className="Data-row">
        <div>Parent Technology</div>
        <div>
          <Link to={`/technology/${technology.parentTechnology.technologyId}`}>
            {technology.parentTechnology.name}
          </Link>
        </div>
      </div>}
    { !childTechnologiesJsx.length ? undefined
      : <div className="Data-row">
          <div>Child Technologies</div>
          <div>
            <ul>
              {childTechnologiesJsx}
            </ul>
          </div>
        </div>}
    <Links links={technology.generalLinks}/>
    <div className="Data-row">
      <div>Business Capabilities</div>
      <div>
        <ul>
          {technology.capabilities.map(c => (
            <li key={c.capabilityId}>
              <Link key={c.capabilityId} to={`/capability/${c.capabilityId}`}>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
    { !dataEntitiesJsx.length ? undefined
      : <div className="Data-row">
          <div>Data Entities</div>
          <div>
            <table>
              <thead><tr><th>Role</th><th>Entity</th><th>Description</th></tr></thead>
              <tbody>
                {dataEntitiesJsx}
              </tbody>
            </table>
          </div>
        </div>}
  </div>;
};

export default observer(component);
