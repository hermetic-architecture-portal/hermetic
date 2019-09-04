import { observable } from 'mobx';
import localforage from 'localforage';
import { features } from 'hermetic-common';
import api from '../api';
import modelStore from './modelStore';

const sandboxKey = 'sandbox';

const userStore = {
  sandboxes: observable([]),
  sandboxOptions: observable({
    selected: null,
  }),

  data: observable({
    displayName: '',
    allowedFeatures: [],
  }),

  innerLoad: async () => {
    const data = await api.getAccessRights();
    userStore.data.displayName = data.displayName;
    if (data.allowedFeatures) {
      userStore.data.allowedFeatures.replace(data.allowedFeatures);
    }
  },

  load: async () => {
    await userStore.innerLoad();
    if (userStore.data.allowedFeatures.includes(features.edit)) {
      await userStore.loadSandboxes();
    } else {
      userStore.selectSandbox(null, false);
    }
  },

  loadSandboxes: async () => {
    if (userStore.sandboxes.length) {
      return;
    }
    const data = await api.getSandboxes();
    const selected = await localforage.getItem(sandboxKey);
    if (selected && data.find(sb => sb.sandbox === selected)) {
      userStore.selectSandbox(selected, false);
    }
    userStore.sandboxes.replace(data);
  },

  selectSandbox: async (sandbox, userInitiated = true) => {
    if (userInitiated) {
      await localforage.setItem(sandboxKey, sandbox);
      modelStore.reset();
    }
    api.sandbox = sandbox;
    userStore.sandboxOptions.selected = sandbox;
  },

};

export default userStore;
