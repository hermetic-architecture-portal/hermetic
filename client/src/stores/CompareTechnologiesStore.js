import { observable } from 'mobx';
import { features } from 'hermetic-common';
import modelStore from './modelStore';
import userStore from './userStore';

class CompareTechnologiesStore {
  constructor() {
    const url = new window.URL(window.location.href);
    this.technologyIds = observable(url.searchParams.getAll('technologyId'));
  }

  updateLocation() {
    const url = new window.URL(window.location.href);
    url.searchParams.delete('technologyId');
    this.technologyIds.forEach(t => url.searchParams.append('technologyId', t));
    window.history.replaceState(null, null, url.href);
  }

  addTechnology(technologyId) {
    if (!this.technologyIds.includes(technologyId)) {
      this.technologyIds.push(technologyId);
    }
    this.loadSelectedTechnologies();
    this.updateLocation();
  }

  removeTechnology(technologyId) {
    if (this.technologyIds.includes(technologyId)) {
      this.technologyIds.remove(technologyId);
    }
    this.loadSelectedTechnologies();
    this.updateLocation();
  }

  async loadSelectedTechnologies() {
    let promises = this.technologyIds.map(t => modelStore.loadTechnologyDetail(t));
    await Promise.all(promises);
    if (userStore.data.allowedFeatures.includes(features.techDetails)) {
      promises = this.technologyIds.map(t => modelStore.loadTechnologyTechDetail(t));
      await Promise.all(promises);
    }
    if (userStore.data.allowedFeatures.includes(features.technologyHealthMetrics)) {
      promises = this.technologyIds.map(t => modelStore.loadTechnologyHealthDetail(t));
      await Promise.all(promises);
    }
  }
}

export default CompareTechnologiesStore;
