import { observable } from 'mobx';
import constants from '../constants';
import modelStore from './modelStore';

class TechRefModelOverlayStore {
  constructor() {
    this.overlays = observable(constants.defaultTechRefModelOverlays.slice());
  }

  addOverlay(overlay) {
    this.overlays.push(overlay);
    if (overlay === constants.techRefModelOverlays.technologyHealth) {
      modelStore.loadTechnologyHealthMetricTotals();
    }
    if (overlay === constants.techRefModelOverlays.standardAssessments) {
      modelStore.loadTechnicalStandardAssessments();
    }
  }

  removeOverlay(overlay) {
    this.overlays.remove(overlay);
  }
}

const techRefModelOverlayStore = new TechRefModelOverlayStore();

export default techRefModelOverlayStore;
