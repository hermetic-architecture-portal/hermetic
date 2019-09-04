import { observable } from 'mobx';
import constants from '../constants';
import modelStore from './modelStore';

class EaRefModelOverlayStore {
  constructor() {
    this.overlays = observable(constants.defaultEaRefModelOverlays.slice());
  }

  addOverlay(overlay) {
    this.overlays.push(overlay);
    if (overlay === constants.eaRefModelOverlays.eaHealth) {
      modelStore.loadEaMetricTotals();
    }
  }

  removeOverlay(overlay) {
    this.overlays.remove(overlay);
  }
}

const eaRefModelOverlayStore = new EaRefModelOverlayStore();

export default eaRefModelOverlayStore;
