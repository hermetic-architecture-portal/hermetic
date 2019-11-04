import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import TechRefModelTechnology from './TechRefModelTechnology';
import TechRefModelFunctionalCapability from './TechRefModelFunctionalCapability';
import SectionToggleWidget from '../shared/SectionToggleWidget';
import SectionVisibilityWrapper from '../shared/SectionVisibilityWrapper';
import constants from '../../constants';
import techRefModelOverlayStore from '../../stores/techRefModelOverlayStore';

const TechRefModelCategory = ({ trmCategoryId }) => {
  const category = modelStore.techRefModelCategories
    .find(c => c.trmCategoryId === trmCategoryId);
  if (!category) {
    return null;
  }
  let technologies = [];
  if (techRefModelOverlayStore.overlays.includes(constants.techRefModelOverlays.technologies)) {
    technologies = (category.technologies || [])
      .map((t) => {
        const technology = modelStore.technologies
          .find(tech => tech.technologyId === t.technologyId);
        if ((!technology) || technology.parentTechnologyId) {
          return null;
        }
        return <TechRefModelTechnology
          technology={technology} key={t.technologyId} />;
      })
      .filter(t => !!t);
  }
  let functionalCapabilities = [];
  if (techRefModelOverlayStore.overlays.includes(
    constants.techRefModelOverlays.functionalCapabilities,
  )) {
    functionalCapabilities = modelStore.functionalCapabilities
      .filter(c => c.trmCategoryId === trmCategoryId)
      .map(c => <TechRefModelFunctionalCapability
          functionalCapability={c} key={c.functionalCapabilityId} />);
  }
  const hasChildren = technologies.length || functionalCapabilities.length;
  return <div className="TRM-category">
    <div>
      <SectionToggleWidget sectionName={trmCategoryId}
        sectionType="TRMCategory" hasChildren={hasChildren} />
      {category.name}
    </div>
    <SectionVisibilityWrapper sectionName={trmCategoryId} sectionType="TRMCategory">
      {technologies}
      {functionalCapabilities}
    </SectionVisibilityWrapper>
  </div>;
};

export default observer(TechRefModelCategory);
