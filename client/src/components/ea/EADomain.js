import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import SectionToggleWidget from '../shared/SectionToggleWidget';
import SectionVisibilityWrapper from '../shared/SectionVisibilityWrapper';
import EAArtifact from './EAArtifact';

const EADomain = ({ domain }) => {
  const artifacts = (domain.artifacts || [])
    .map(a => <EAArtifact artifact={a} key={a.eaArtifactId}/>);
  const toggleWidget = !artifacts.length ? undefined
    : <SectionToggleWidget sectionName={domain.eaDomainId}
        sectionType="EADomain" hasChildren={true}/>;
  const artifactsWrapper = !artifacts.length ? undefined
    : <SectionVisibilityWrapper sectionName={domain.eaDomainId} sectionType="EADomain">
    {artifacts}
  </SectionVisibilityWrapper>;
  const className = artifacts.length ? 'EA-domain' : 'EA-domain no-children';
  return <div className={className}>
    <div className="Head-1">
      {toggleWidget}
      {domain.name}
    </div>
    {artifactsWrapper}
  </div>;
};

export default observer(EADomain);
