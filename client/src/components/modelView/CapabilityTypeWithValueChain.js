import React from 'react'; // eslint-disable-line no-unused-vars
import ValueChain from './ValueChain';
import SectionToggleWidget from '../shared/SectionToggleWidget';
import SectionVisibilityWrapper from '../shared/SectionVisibilityWrapper';

export default ({ capabilityType, capabilityOverlayStore }) => {
  const { valueChains } = capabilityType;

  return <div className="Capability-type">
    <div className="Head-1">
      <SectionToggleWidget sectionName={capabilityType.name} sectionType="CapType"
         hasChildren="true"/>
      {capabilityType.name} Capabilities
    </div>
    <SectionVisibilityWrapper sectionName={capabilityType.name} sectionType="CapType">
      {valueChains.map(vc => <ValueChain
        key={vc.valueChainId}
        valueChain={vc}
        capabilityType={capabilityType}
        capabilityOverlayStore={capabilityOverlayStore}/>)}
    </SectionVisibilityWrapper>
  </div>;
};
