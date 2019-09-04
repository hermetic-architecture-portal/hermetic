import { observable } from 'mobx';

const makeIdentifier = (sectionName, sectionType) => `${sectionType}-${sectionName}`;

const sectionsStore = {
  hiddenSections: observable([]),

  isHidden: (sectionName, sectionType) => {
    const identifier = makeIdentifier(sectionName, sectionType);
    return sectionsStore.hiddenSections.includes(identifier);
  },

  hide: (sectionType, sectionNames) => {
    const newHiddenSections = sectionsStore.hiddenSections
      .filter(h => !h.startsWith(`${sectionType}-`));
    newHiddenSections.push(...sectionNames.map(n => makeIdentifier(n, sectionType)));
    sectionsStore.hiddenSections.replace(newHiddenSections);
  },

  toggleSection: (sectionName, sectionType) => {
    const identifier = makeIdentifier(sectionName, sectionType);
    if (sectionsStore.hiddenSections.includes(identifier)) {
      sectionsStore.hiddenSections.remove(identifier);
    } else {
      sectionsStore.hiddenSections.push(identifier);
    }
  },
};

export default sectionsStore;
