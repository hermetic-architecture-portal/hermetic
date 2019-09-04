import { observable } from 'mobx';

const loadingStore = {
  inFlightItems: observable([]),
  add: item => loadingStore.inFlightItems.push(item),
  remove: item => loadingStore.inFlightItems.remove(item),
};

export default loadingStore;
