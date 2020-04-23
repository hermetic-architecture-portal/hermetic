import React from 'react'; // eslint-disable-line no-unused-vars
import { Link } from 'react-router-dom';
import ExtensionFields from '../shared/ExtensionFields';
import Links from '../shared/Links';

export default ({ technology, environmentId }) => {
  const nodes = technology.nodes
    .filter(node => node.isCore)
    .map((node) => {
      const envNodes = node.environmentNodes
        .filter(en => en.environmentId === environmentId)
        .map(en => <li key={en.name}>
          <Link to={`/server/${en.nodeId}`}>{en.name}</Link>
        </li>);
      return <li key={node.nodeId}>
        <Link to={`/server/${node.nodeId}`}>{node.name}</Link>
        {!envNodes.length ? undefined
          : <ul>
            {envNodes}
          </ul>}
      </li>;
    });
  const supportingTechnologies = technology.supportingTechnologies
    .map(st => <li key={st.technologyId}>
      <Link to={`/technology/${st.technologyId}`}>{st.name}</Link>
    </li>);
  const supportsTechnologies = technology.supportsTechnologies
    .map(st => <li key={st.technologyId}>
      <Link to={`/technology/${st.technologyId}`}>{st.name}</Link>
    </li>);
  const functionalCapabilities = technology.functionalCapabilities
    .map(fc => <li key={fc.functionalCapabilityId}>
      <Link to={`/functionalCapability/${fc.functionalCapabilityId}`}>{fc.name}</Link>
    </li>);

  return <div className="Left-col">
    <div className="Head-1">{technology.name}</div>
    <div className="Data-row">
      <div>SLA Level</div>
      <div>{technology.slaLevel}</div>
    </div>
    <div className="Data-row">
      <div>Disaster Recovery</div>
      <div>{technology.disasterRecovery}</div>
    </div>
    <div className="Data-row">
      <div>Technology Type</div>
      <div>{technology.technologyType}</div>
    </div>
    <div className="Data-row">
      <div>Category</div>
      <div>{technology.category}</div>
    </div>
    <div className="Data-row">
      <div>Lifecycle Status</div>
      <div>{technology.lifecycleStatus}</div>
    </div>
    <div className="Data-row">
      <div>Standard Level</div>
      <div>{!technology.standardLevel ? undefined
        : technology.standardLevel.name}
      </div>
    </div>
    <div className="Data-row">
      <div>Standard Notes</div>
      <div>{technology.standardNotes}</div>
    </div>
    <div className="Data-row">
      <div>Contacts</div>
      <div>
        <ul>{!technology.contacts ? undefined
          : technology.contacts.map(c => <li key={c}>{c}</li>)}
        </ul>
      </div>
    </div>
    <div className="Data-row">
      <div>Authentication</div>
      <div>
        <ul>
          {technology.authenticationInternalStore === 'Yes' ? <li>Internal store</li> : ''}
          {technology.authenticationTechnology
            ? <li><Link to={`/technology/${technology.authenticationTechnology.technologyId}`}>
              {technology.authenticationTechnology.name}
              </Link></li> : ''}
          {technology.authenticationNotes ? <li>{technology.authenticationNotes}</li> : ''}
        </ul>
      </div>
    </div>
    <div className="Data-row">
      <div>Authorisation</div>
      <div>
        <ul>
          {technology.authorisationInternalStore === 'Yes' ? <li>Internal store</li> : ''}
          {technology.authorisationTechnology
            ? <li><Link to={`/technology/${technology.authorisationTechnology.technologyId}`}>
              {technology.authorisationTechnology.name}
              </Link></li> : ''}
          {technology.authorisationNotes ? <li>{technology.authorisationNotes}</li> : ''}
        </ul>
      </div>
    </div>
    <Links links={technology.technicalLinks} />
    <ExtensionFields entity={technology} />
    <div className="Data-row">
      <div>Network Nodes</div>
      <div>
        <ul>
          {nodes}
        </ul>
      </div>
    </div>
    <div className="Data-row">
      <div>Supporting Technologies</div>
      <div>
        <ul>
          {supportingTechnologies}
        </ul>
      </div>
    </div>
    <div className="Data-row">
      <div>Supports Technologies</div>
      <div>
        <ul>
          {supportsTechnologies}
        </ul>
      </div>
    </div>
    <div className="Data-row">
      <div>Functional Capabilities</div>
      <div>
        <ul>
          {functionalCapabilities}
        </ul>
      </div>
    </div>
  </div>;
};
