import { ApiProxy, utils } from 'react-auto-edit';

class HermeticEditApiProxy extends ApiProxy {
  constructor(schema, baseApiPath) {
    super(schema, baseApiPath, {
      filterMode: ApiProxy.filterModes.serverSide,
      pagingMode: ApiProxy.pagingModes.serverSide,
    });
  }

  getPageAndFilterParams(page, filter) {
    const result = super.getPageAndFilterParams(page, filter);
    // remove the pageSize param which we don't support
    return result.filter(p => !p.startsWith('pageSize'));
  }

  collectionSummaryIncludesFullEntities(collectionSchemaPath) {
    const itemSchemaDesc = utils.reach(this.schema, `${collectionSchemaPath}.[]`).describe();
    if (itemSchemaDesc.meta && itemSchemaDesc.meta.some(m => m.fullEntityInSummary)) {
      return true;
    }
    return super.collectionSummaryIncludesFullEntities(collectionSchemaPath);
  }

  async fetchJson(url, options) {
    let newUrl = url;
    if (this.sandbox) {
      if (newUrl.includes('?')) {
        newUrl = `${newUrl}&sandbox=${this.sandbox}`;
      } else {
        newUrl = `${newUrl}?sandbox=${this.sandbox}`;
      }
    }
    return super.fetchJson(newUrl, options);
  }
}

export default HermeticEditApiProxy;
