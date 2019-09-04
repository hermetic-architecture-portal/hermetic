/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
// network node name (as opposed to id)
// was optional and never very useful so drop it
const dropNetworkNodeName = (data) => {
  console.log('Migration: dropNetworkNodeName');
  if (data.networkNodes && data.networkNodes
    .some(nn => !!nn.name)) {
    console.log('Migration required');
    data.networkNodes
      .filter(nn => !!nn.name)
      .forEach((nn) => { delete nn.name; });
  }
};
export default dropNetworkNodeName;
