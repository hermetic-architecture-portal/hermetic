import React from 'react'; // eslint-disable-line no-unused-vars
import { Link } from 'react-router-dom';

export default ({ node, technologyId }) => {
  const executionEnvironments = node.executionEnvironments
    .map(ee => <div className="Execution-environment" key={ee}>
      <div>&lt;&lt;executionEnvironment&gt;&gt;</div>
      <div>{ee}</div>
      {node.components
        .filter(c => c.executionEnvironment === ee)
        .map(c => <div className="Deployment-artifact" key={c.componentId}>
          <div>&lt;&lt;artifact&gt;&gt;</div>
          <div><Link to={`/technology/${technologyId}/components`}>{c.componentId}</Link></div>
        </div>)
      }
    </div>);
  const components = node.components
    .filter(c => !c.executionEnvironment)
    .map(c => <div className="Deployment-artifact" key={c.componentId}>
      <div>&lt;&lt;artifact&gt;&gt;</div>
      <div><Link to={`/technology/${technologyId}/components`}>{c.componentId}</Link></div>
    </div>);

  return <div className="Deployment-node">
    <div>&lt;&lt;processingNode&gt;&gt;</div>
    <div><Link to={`/server/${node.nodeId}`}>{node.name || node.nodeId}</Link></div>
    {executionEnvironments}
    {components}
  </div>;
};
