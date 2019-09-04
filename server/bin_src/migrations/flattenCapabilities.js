/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
// capabilities was stored as a yaml tree
// flatten this so it's easier to look up foreign keys
const flattenCapabilities = (data) => {
  console.log('Migration: flattenCapabilities');
  if (data.capabilityTypes) {
    console.log('Migration required');
    const newCapabilityTypes = [];
    data.capabilities = [];
    data.valueChains = [];
    data.capabilityTypes.forEach((ct) => {
      newCapabilityTypes.push({
        capabilityTypeId: ct.capabilityTypeId,
        name: ct.name,
      });
      (ct.valueChains || []).forEach((vc) => {
        const newVc = {
          valueChainId: vc.valueChainId,
          name: vc.name,
          capabilityTypeId: ct.capabilityTypeId,
          valueChainSegments: [],
        };
        data.valueChains.push(newVc);
        vc.valueChainSegments.forEach((vcs) => {
          const newVcs = {
            valueChainSegmentId: vcs.valueChainSegmentId,
            name: vcs.name,
          };
          if (vcs.displayOrder) {
            newVcs.displayOrder = vcs.displayOrder;
          }
          newVc.valueChainSegments.push(newVcs);
        });
      });
      ct.capabilities.forEach((c) => {
        const newCap = {
          capabilityId: c.capabilityId,
          name: c.name,
        };
        if (c.parentCapabilityId) {
          newCap.parentCapabilityId = c.parentCapabilityId;
        }
        if (c.description) {
          newCap.description = c.description;
        }
        if (c.links) {
          newCap.links = c.links;
        }
        if (c.valueChainSegments) {
          newCap.valueChainSegments = c.valueChainSegments
            .map(cvcs => ({
              valueChainId: ct.valueChains.find(vc => vc.valueChainSegments
                .some(vcs => vcs.valueChainSegmentId === cvcs.valueChainSegmentId))
                .valueChainId,
              valueChainSegmentId: cvcs.valueChainSegmentId,
            }));
        }
        newCap.capabilityTypeId = ct.capabilityTypeId;
        data.capabilities.push(newCap);
      });
    });
    if (!data.valueChains.length) {
      delete data.valueChains;
    }
    data.capabilityTypes = newCapabilityTypes;
  }
};
export default flattenCapabilities;
