import React from 'react'; // eslint-disable-line no-unused-vars
import Capability from './Capability';
import SectionToggleWidget from '../shared/SectionToggleWidget';
import SectionVisibilityWrapper from '../shared/SectionVisibilityWrapper';

export default ({ capabilityType, capabilityOverlayStore }) => <div className="Capability-type">
  <div className="Head-1">
    <SectionToggleWidget sectionName={capabilityType.name} sectionType="CapType"
      hasChildren="true"/>
    {capabilityType.name} Capabilities
  </div>
  <SectionVisibilityWrapper sectionName={capabilityType.name} sectionType="CapType">
    {capabilityType.capabilities
      .filter(cap => !cap.parentCapabilityId)
      .map(cap => (<div
      className="Capability" key={cap.capabilityId}>
      <Capability capability={cap} level={1} capabilities={capabilityType.capabilities}
        capabilityOverlayStore={capabilityOverlayStore} />
    </div>))}
  </SectionVisibilityWrapper>
</div>;
