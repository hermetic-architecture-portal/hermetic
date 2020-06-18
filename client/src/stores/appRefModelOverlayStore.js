import { observable } from 'mobx';
import constants from '../constants';
import modelStore from './modelStore';

class AppRefModelOverlayStore {
  constructor() {
    this.overlays = observable(constants.defaultAppRefModelOverlays.slice());
    this.filters = observable({
      technologyCategoryId: 'any',
    });
  }

  addOverlay(overlay) {
    this.overlays.push(overlay);
    if (overlay === constants.appRefModelOverlays.techHealth) {
      modelStore.loadTechnologyHealthMetricTotals();
    }
  }

  removeOverlay(overlay) {
    this.overlays.remove(overlay);
  }
}

const appRefModelOverlayStore = new AppRefModelOverlayStore();

export default appRefModelOverlayStore;
