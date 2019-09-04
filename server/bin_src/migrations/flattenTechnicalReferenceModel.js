/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
const flattenTechnicalReferenceModel = (data) => {
  console.log('Migration: flattenTechnicalReferenceModel');
  if (data.technicalReferenceModel) {
    console.log('Migration required');
    data.technicalReferenceModelLayers = [];
    data.technicalReferenceModelCategories = [];

    data.technicalReferenceModel.categories.forEach((c) => {
      data.technicalReferenceModelCategories.push(c);
    });

    data.technicalReferenceModel.layers.forEach((l) => {
      const newLayer = Object.assign({}, l);
      delete newLayer.categories;
      data.technicalReferenceModelLayers.push(newLayer);
      l.categories.forEach((lc) => {
        const c = data.technicalReferenceModelCategories
          .find(match => match.trmCategoryId === lc.trmCategoryId);
        c.trmLayerId = l.trmLayerId;
      });
    });

    delete data.technicalReferenceModel;
  }
};
export default flattenTechnicalReferenceModel;
