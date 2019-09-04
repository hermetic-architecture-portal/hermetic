import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import sectionsStore from '../../stores/sectionsStore';

const SectionVisibilityWrapper = ({ sectionName, children, sectionType }) => {
  const className = sectionsStore.isHidden(sectionName, sectionType) ? 'hidden' : 'visible';
  return <div className={`Section-visibility ${className}`}>{children}</div>;
};

export default observer(SectionVisibilityWrapper);
