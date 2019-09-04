import React from 'react'; // eslint-disable-line no-unused-vars
import CapabilitiesRow from './CapabilitiesRow';

// find a row in the table that has room to fit a capability
// across all its value chain items
const findRow = (capability, rows) => rows.find(
  row => capability.valueChainSegments.every(
    segment => row.some(
      col => !col.capability // empty column
        && (col.valueChainSegmentId === segment.valueChainSegmentId),
    ),
  ),
);

const segmentIsInValueChain = (valueChainSegmentId, valueChain) => valueChain
  .valueChainSegments.some(vcs => vcs.valueChainSegmentId === valueChainSegmentId);

const makeRow = valueChain => valueChain.valueChainSegments
  .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
  .map(segment => ({
    valueChainId: valueChain.valueChainId,
    valueChainSegmentId: segment.valueChainSegmentId,
  }));

// eslint-disable-next-line object-curly-newline
export default ({ valueChain, capabilityType, capabilityOverlayStore }) => {
  const capabilities = capabilityType.capabilities
    .filter(cap => !cap.parentCapabilityId)
    .filter(cap => cap.valueChainSegments && cap.valueChainSegments
      .some(capVcs => segmentIsInValueChain(capVcs.valueChainSegmentId, valueChain)))
    .sort((a, b) => a.valueChainSegments.length - b.valueChainSegments.length);

  // add first row, with columns corresponding to vc segments
  const displayRows = [makeRow(valueChain)];

  // allocate capabilities to layout rows and columns
  while (capabilities.length > 0) {
    const capability = capabilities[0];
    const displayRow = findRow(capability, displayRows);
    if (!displayRow) {
      // existing rows are full, add another
      displayRows.push(makeRow(valueChain));
    } else {
      capabilities.shift();
      displayRow.filter(col => capability.valueChainSegments.some(
        segment => segment.valueChainSegmentId === col.valueChainSegmentId,
      )).forEach(
        (col) => {
          // eslint-disable-next-line no-param-reassign
          col.capability = capability;
        },
      );
    }
  }

  return displayRows.map((displayRow, index) => <CapabilitiesRow
      capabilityOverlayStore={capabilityOverlayStore}
      key={index} cols={displayRow} otherCapabilities={capabilityType.capabilities} />);
};
