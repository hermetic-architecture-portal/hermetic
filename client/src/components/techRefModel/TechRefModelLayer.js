import React from 'react'; // eslint-disable-line no-unused-vars
import SectionToggleWidget from '../shared/SectionToggleWidget';
import SectionVisibilityWrapper from '../shared/SectionVisibilityWrapper';
import TechRefModelCategory from './TechRefModelCategory';

const TechRefModelLayer = ({ layer }) => {
  const categories = (layer.categories || [])
    .map(category => <TechRefModelCategory
      trmCategoryId={category.trmCategoryId} key={category.trmCategoryId}/>);
  return <div className="TRM-layer">
    <div className="Head-1">
      <SectionToggleWidget sectionName={layer.trmLayerId} sectionType="TechLayer"
         hasChildren="true"/>
      {layer.name}
    </div>
    <SectionVisibilityWrapper sectionName={layer.trmLayerId} sectionType="TechLayer">
      {categories}
    </SectionVisibilityWrapper>
  </div>;
};

export default TechRefModelLayer;
