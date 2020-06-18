import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import SectionToggleWidget from '../shared/SectionToggleWidget';
import SectionVisibilityWrapper from '../shared/SectionVisibilityWrapper';
import modelStore from '../../stores/modelStore';
import appRefModelOverlayStore from '../../stores/appRefModelOverlayStore';
import AppRefModelTechnology from './AppRefModelTechnology';

const AppRefModelDomain = ({ domain }) => {
  const ObserverAppRefDomain = observer(AppRefModelDomain);
  const childDomains = modelStore.appRefModelDomains
    .filter(d => d.parentArmDomainId === domain.armDomainId)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    .map(d => <ObserverAppRefDomain
      domain={d} key={d.armDomainId}/>);
  const technologies = modelStore.appRefModelTechnologies
    .filter(t => t.armDomainId === domain.armDomainId)
    .filter(a => (appRefModelOverlayStore.filters.technologyCategoryId === 'any')
      || (a.technologyCategoryId === appRefModelOverlayStore.filters.technologyCategoryId))
    .map(t => <AppRefModelTechnology technology={t} key={t.technologyId} />);
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
