import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import TechRefModelTechnology from './TechRefModelTechnology';
import SectionToggleWidget from '../shared/SectionToggleWidget';
import SectionVisibilityWrapper from '../shared/SectionVisibilityWrapper';

const TechRefModelCategory = ({ trmCategoryId }) => {
  const category = modelStore.techRefModelCategories
    .find(c => c.trmCategoryId === trmCategoryId);
  if (!category) {
    return null;
  }
  const technologies = (category.technologies || [])
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
  return <div className="TRM-category">
    <div>
      <SectionToggleWidget sectionName={trmCategoryId}
        sectionType="TRMCategory" hasChildren={!!technologies.length} />
      {category.name}
    </div>
    <SectionVisibilityWrapper sectionName={trmCategoryId} sectionType="TRMCategory">
      {technologies}
    </SectionVisibilityWrapper>
  </div>;
};

export default observer(TechRefModelCategory);
