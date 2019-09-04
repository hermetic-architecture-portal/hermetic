import React from 'react'; // eslint-disable-line no-unused-vars
import ValueChainCapabilities from './ValueChainCapabilities';
import ValueChainSegment from './ValueChainSegment';
import SectionToggleWidget from '../shared/SectionToggleWidget';
import SectionVisibilityWrapper from '../shared/SectionVisibilityWrapper';

export default ({ valueChain, capabilityType, capabilityOverlayStore }) => <div>
  <div className="Head-2">
    <SectionToggleWidget sectionName={valueChain.name} sectionType="ValueChain"
       hasChildren="true"/>
    {valueChain.name}
  </div>
  <SectionVisibilityWrapper sectionName={valueChain.name} sectionType="ValueChain">
    <div>
      <div className="Capability-row">
        {valueChain.valueChainSegments
          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
          .map(seg => <ValueChainSegment
            valueChainSegmentId={seg.valueChainSegmentId} key={seg.valueChainSegmentId}
            valueChainSegmentName={seg.name} />)}
      </div>
      <ValueChainCapabilities
        valueChain={valueChain}
        capabilityType={capabilityType}
        capabilityOverlayStore={capabilityOverlayStore}/>
    </div>
  </SectionVisibilityWrapper>
</div>;
