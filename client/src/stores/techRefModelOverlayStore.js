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
    if (overlay === constants.techRefModelOverlays.technologies) {
      this.overlays.remove(constants.techRefModelOverlays.technologyHealth);
      this.overlays.remove(constants.techRefModelOverlays.standardAssessments);
    }
  }
}

const techRefModelOverlayStore = new TechRefModelOverlayStore();

export default techRefModelOverlayStore;
