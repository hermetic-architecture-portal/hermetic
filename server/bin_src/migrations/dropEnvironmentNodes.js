/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
// remove environmentNodes - instead they will be
// a special kind of networkNode
const dropEnvironmentNodes = (data) => {
  console.log('Migration: environmentNodes');
  if (data.environmentNodes) {
    console.log('Migration required');
    if (!data.networkNodes) {
      data.networkNodes = [];
    }
    data.networkNodes.forEach((nn) => {
      nn.isAbstractNode = true;
    });
    data.environmentNodes.forEach((en) => {
      let networkNode = data.networkNodes.find(n => n.nodeId === en.nodeId);
      if (!networkNode) {
        networkNode = {
          nodeId: en.nodeId,
          isAbstractNode: false,
          implementsNodes: [],
          environmentId: en.environmentId,
        };
        if (en.name) {
          networkNode.name = en.name;
        }
        data.networkNodes.push(networkNode);
      }
      if (en.implementsNodeId) {
        networkNode.implementsNodes.push({
          nodeId: en.implementsNodeId,
        });
      }
    });
    delete data.environmentNodes;
  }
};
export default dropEnvironmentNodes;
