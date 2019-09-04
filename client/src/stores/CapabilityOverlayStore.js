import { observable } from 'mobx';
import constants from '../constants';
import modelStore from './modelStore';

class CapabilityOverlayStore {
  constructor(maxLevel = 1) {
    this.overlays = observable(constants.defaultCapabilityOverlays.slice());
    this.capabilityLevel = observable({
      max: maxLevel,
    });
    this.expandedCapabilities = observable([]);
    this.collapsedCapabilities = observable([]);
  }

  setCapabilityLevel(level) {
    this.capabilityLevel.max = level;
    this.expandedCapabilities.clear();
    this.collapsedCapabilities.clear();
  }

  toggleExpansion(capabilityId, capabilityLevel) {
    if (this.shouldShowChildCapabilities(capabilityId, capabilityLevel)) {
      this.expandedCapabilities.remove(capabilityId);
      this.collapsedCapabilities.push(capabilityId);
    } else {
      this.collapsedCapabilities.remove(capabilityId);
      this.expandedCapabilities.push(capabilityId);
    }
  }

  shouldShowChildCapabilities(capabilityId, capabilityLevel) {
    return (
      (this.capabilityLevel.max > capabilityLevel)
      && !this.collapsedCapabilities.includes(capabilityId)
    ) || this.expandedCapabilities.includes(capabilityId);
  }

  addOverlay(overlay) {
    this.overlays.push(overlay);
    if (overlay === constants.capabilityOverlays.technologyHealth) {
      modelStore.loadTechnologyHealthMetricTotals();
    }
    if (overlay === constants.capabilityOverlays.capabilityHealth) {
      modelStore.loadCapabilityHealthMetricTotals();
    }
    if (overlay === constants.capabilityOverlays.capabilityHeadcount) {
      modelStore.loadCapabilityResourcing();
    }
    if (overlay === constants.capabilityOverlays.businessUnits) {
      modelStore.loadBusinessUnits();
    }
  }

  removeOverlay(overlay) {
    this.overlays.remove(overlay);
    if ((overlay === constants.capabilityOverlays.technologies)
      && this.overlays.includes(constants.capabilityOverlays.technologyHealth)) {
      this.overlays.remove(constants.capabilityOverlays.technologyHealth);
    }
  }
}

CapabilityOverlayStore.mainView = new CapabilityOverlayStore();

export default CapabilityOverlayStore;
