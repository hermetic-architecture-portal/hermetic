import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import SectionToggleWidget from '../shared/SectionToggleWidget';
import SectionVisibilityWrapper from '../shared/SectionVisibilityWrapper';
import modelStore from '../../stores/modelStore';
import AppRefModelDomain from './AppRefModelDomain';

const AppRefModelDomainGroup = ({ group }) => {
  const domains = modelStore.appRefModelDomains
    .filter(d => (d.armDomainGroupId === group.armDomainGroupId)
      && (!d.parentArmDomainId))
    .map(domain => <AppRefModelDomain
      domain={domain} key={domain.armDomainId}/>);
  return <div className="ARM-domain-group">
    <div className="Head-1">
      <SectionToggleWidget sectionName={group.armDomainGroupId} sectionType="ARMDomainGroup"
         hasChildren="true"/>
      {group.name}
    </div>
    <SectionVisibilityWrapper sectionName={group.armDomainGroupId} sectionType="ARMDomainGroup">
      {domains}
    </SectionVisibilityWrapper>
  </div>;
};

export default observer(AppRefModelDomainGroup);
