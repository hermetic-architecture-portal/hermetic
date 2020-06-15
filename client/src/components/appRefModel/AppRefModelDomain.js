import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import SectionToggleWidget from '../shared/SectionToggleWidget';
import SectionVisibilityWrapper from '../shared/SectionVisibilityWrapper';
import modelStore from '../../stores/modelStore';
import AppRefModelTechnology from './AppRefModelTechnology';

const AppRefModelDomain = ({ domain }) => {
  const childDomains = modelStore.appRefModelDomains
    .filter(d => d.parentArmDomainId === domain.armDomainId)
    .map(d => <AppRefModelDomain
      domain={d} key={d.armDomainId}/>);
  const technologies = modelStore.appRefModelTechnologies
    .filter(t => t.armDomainId === domain.armDomainId)
    .map(t => <AppRefModelTechnology technology={t} key={t.technologyid} />);
  return <div className="ARM-domain">
    <div>
      <SectionToggleWidget sectionName={domain.armDomainId} sectionType="ARMDomain"
         hasChildren="true"/>
      {domain.name}
    </div>
    <SectionVisibilityWrapper sectionName={domain.armDomainId} sectionType="ARMDomain">
      { childDomains }
      { technologies }
    </SectionVisibilityWrapper>
  </div>;
};

export default observer(AppRefModelDomain);
