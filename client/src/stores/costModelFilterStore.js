import { observable } from 'mobx';

const costModelFilterStore = observable({
  yearFrom: 0,
  yearTo: 9999,
  vendorsOrTechnologies: 'technologies',
  topItem: 0,
  excludedCategories: [],
});

export default costModelFilterStore;
