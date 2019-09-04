import utils from './utils';

const getSortPairs = (schemaDesc) => {
  const result = [];
  if (schemaDesc.type === 'object') {
    const keyFields = [];
    const notKeyFields = [];
    Object
      .getOwnPropertyNames(schemaDesc.children)
      .forEach((fieldName) => {
        if (utils.isPkField(schemaDesc.children[fieldName])) {
          keyFields.push(fieldName);
        } else {
          notKeyFields.push(fieldName);
        }
        result.push(...getSortPairs(schemaDesc.children[fieldName]));
      });
    keyFields.forEach((kf) => {
      notKeyFields.forEach(nkf => result.push({
        key: kf,
        notKey: nkf,
      }));
    });
  } else if ((schemaDesc.type === 'array')
    && schemaDesc.items && schemaDesc.items.length) {
    result.push(...getSortPairs(schemaDesc.items[0]));
  }
  return result;
};

const sortKeys = (schema) => {
  const schemaDesc = schema.describe ? schema.describe() : schema;
  const sortPairs = getSortPairs(schemaDesc);
  const func = (x, y) => {
    if (sortPairs.find(p => (p.key === x) && (p.notKey === y))) {
      return -1;
    }
    if (sortPairs.find(p => (p.key === y) && (p.notKey === x))) {
      return 1;
    }
    return x.localeCompare(y);
  };
  return func;
};

export default sortKeys;
