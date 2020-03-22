import { observable } from 'mobx';
import localforage from 'localforage';
import { Controller } from 'react-auto-edit';

const sandboxKey = 'sandbox';

class HermeticEditController extends Controller {
  constructor(schema, apiProxy, options) {
    super(schema, apiProxy, options);
    this.sandboxState = observable({
      ready: false,
      sandboxes: [],
      selectedSandbox: false,
    });
  }

  async _loadSandboxes(force) {
    if (this.sandboxState.ready && !force) {
      return;
    }
    const sandboxes = await this.apiProxy.fetchJson(`${this.apiProxy.baseApiPath}/sandbox`);
    this.sandboxState.sandboxes.replace(sandboxes);
    const selectedSandbox = await localforage.getItem(sandboxKey);
    if (selectedSandbox && sandboxes.find(sb => sb.sandbox === selectedSandbox)) {
      await this.setSelectedSandbox(selectedSandbox);
    }
    this.sandboxState.ready = true;
  }


  async loadSandboxes(force) {
    // this is used to make sure that only one component
    // tries to load the sandboxes, but every other component waits until
    // the load is finished
    if (this.loadingPromise) {
      await this.loadingPromise;
    } else {
      try {
        this.loadingPromise = await this._loadSandboxes(force);
      } finally {
        this.loadingPromise = null;
      }
    }
  }

  async setSelectedSandbox(sandbox) {
    this.sandboxState.selectedSandbox = sandbox;
    this.apiProxy.sandbox = sandbox;
    await localforage.setItem(sandboxKey, sandbox);
  }

  async addSandbox(sandbox) {
    await this.apiProxy.fetchJson(`${this.apiProxy.baseApiPath}/sandbox/${sandbox}`, { method: 'POST' });
    await this.loadSandboxes(true);
  }

  async deleteSandbox(sandbox) {
    if (sandbox === this.sandboxState.selectedSandbox) {
      await localforage.removeItem(sandboxKey);
      this.sandboxState.selectedSandbox = false;
    }
    await this.apiProxy.fetchJson(`${this.apiProxy.baseApiPath}/sandbox/${sandbox}`, { method: 'DELETE' });
    this.apiProxy.sandbox = undefined;
    await this.loadSandboxes(true);
  }

  async publishSandbox(sandbox) {
    // eslint-disable-next-line no-alert
    const comment = window.prompt('Describe your changes:');
    if (!comment) {
      // eslint-disable-next-line no-alert
      window.alert('Sandbox was not published');
      return;
    }
    const branch = await this.apiProxy.fetchJson(`${this.apiProxy.baseApiPath}/sandbox/${sandbox}/publish`,
      {
        method: 'POST',
        body: JSON.stringify({ comment }),
      });
    const message = `Sandbox has been pushed to the git server as branch\n"${branch.branch}"\nYou need to raise a pull request to have your change reviewed`;
    // eslint-disable-next-line no-alert
    window.alert(message);
  }

  async loadDetail(container) {
    await this.loadSandboxes();
    await super.loadDetail(container);
  }

  async loadDetailByIds(collectionSchemaPath, parentIds, ids) {
    await this.loadSandboxes();
    await super.loadDetailByIds(collectionSchemaPath, parentIds, ids);
  }

  async loadSearchResult(collectionSchemaPath, parentIds, page, filter) {
    await this.loadSandboxes();
    await super.loadSearchResult(collectionSchemaPath, parentIds, page, filter);
  }

  async loadFkLookupData(container, fieldName, filter) {
    await this.loadSandboxes();
    await super.loadFkLookupData(container, fieldName, filter);
  }

  async prePopulateMetrics(container, fieldName, fkContainer) {
    const fkMetadata = container.getForeignKeyMetadata(fieldName);
    const fkParentIds = [fkContainer.getIds()];
    const fkCollectionSchemaPath = `${fkMetadata.fkCollectionSchemaPath}.[].metrics`;
    // being lazy and assuming there is only one page of metrics...
    await this.loadSearchResult(fkCollectionSchemaPath, fkParentIds, 1);

    const assessmentsPath = `${container.metadata.collectionSchemaPath}.[].assessments`;
    const containerIds = container.getIds();
    const assessmentsParentIds = container.metadata.parentIds.concat(containerIds);

    const metrics = this.getSearchResult(fkCollectionSchemaPath, fkParentIds);
    await Promise.all(metrics.containers
      .map(m => this.loadDetailByIds('metrics', [], { metricId: m.item.metricId })));
    metrics.containers.forEach((mc) => {
      const assessmentContainer = this.addContainer(assessmentsPath, assessmentsParentIds);
      assessmentContainer.setItemFieldValue('metricId', mc.item.metricId);
    });
  }

  setLookupItemContainer(container, fieldName, fkContainer) {
    super.setLookupItemContainer(container, fieldName, fkContainer);
    if ((fieldName === 'metricSetId') && fkContainer && container.isNewItem()) {
      // when metricSetId is set for the first time we want to pre-populate
      // the appropriate set of metrics for fill in
      this.prePopulateMetrics(container, fieldName, fkContainer);
    }
  }
}

export default HermeticEditController;
