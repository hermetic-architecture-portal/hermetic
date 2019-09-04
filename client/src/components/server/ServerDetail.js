import React from 'react'; // eslint-disable-line no-unused-vars
import { Link } from 'react-router-dom';
import ExtensionFields from '../shared/ExtensionFields';

export default ({ node }) => {
  let implemented;
  if (node.implementedNodes && node.implementedNodes.length) {
    const implementedNodes = node.implementedNodes
      .map(i => <li key={i.nodeId}>
          <Link to={`/server/${i.nodeId}`}>
            {i.name}
          </Link>
        </li>);
    implemented = <div className="Data-row">
      <div>Implements</div>
      <div>
        <ul>
          {implementedNodes}
        </ul>
      </div>
    </div>;
  }
  let envNodes;
  if (node.environmentNodes) {
    const envNodesData = [];
    node.environmentNodes.forEach((en) => {
      let env = envNodesData
        .find(e => e.environmentId === en.environment.environmentId);
      if (!env) {
        env = {
          environmentId: en.environment.environmentId,
          environmentName: en.environment.name,
          nodes: [],
        };
        envNodesData.push(env);
      }
      env.nodes.push({
        nodeId: en.nodeId,
        name: en.name,
      });
    });
    envNodes = <div className="Data-row">
    <div>Environment Nodes</div>
    <div>
      <ul>
        {envNodesData.map(e => <li key={e.environmentId}>
          {e.environmentName}
          <ul>
            {e.nodes.map(n => <li key={n.nodeId}>
              <Link to={`/server/${n.nodeId}`}>
                {n.name}
              </Link>
            </li>)}
          </ul>
        </li>)}
      </ul>
    </div>
  </div>;
  }
  let technologies;
  if (node.technologies) {
    technologies = <div className="Data-row">
      <div>Technologies</div>
      <div>
        <ul>
          {node.technologies.map(t => <li key={t.technologyId}>
            <Link to={`/technology/${t.technologyId}`}>
              {t.name}
            </Link>
          </li>)}
        </ul>
      </div>
    </div>;
  }

  return <div className="Left-col">
    <div className="Head-1">{node.name}</div>
    <div className="Data-row">
      <div>Type</div>
      <div>{node.nodeType}</div>
    </div>
    <div className="Data-row">
      <div>Location</div>
      <div>{node.location.name}</div>
    </div>
    <div className="Data-row">
      <div>Environment</div>
      <div>{node.environment.name}</div>
    </div>
    {technologies}
    <ExtensionFields entity={node}/>
    {implemented}
    {envNodes}
  </div>;
};
