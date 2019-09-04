import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import sectionsStore from '../../stores/sectionsStore';

const SectionToggleWidget = ({ sectionName, sectionType, hasChildren }) => {
  let className = sectionsStore.isHidden(sectionName, sectionType) ? 'hidden' : 'visible';
  if (hasChildren) {
    className = `${className} Has-children`;
  }
  return <div className={`Toggle-visibility ${className}`}
    onClick={() => { if (hasChildren) { sectionsStore.toggleSection(sectionName, sectionType); } }}
    ></div>;
};

export default observer(SectionToggleWidget);
