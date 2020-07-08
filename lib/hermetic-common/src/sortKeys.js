import utils from './utils';

const getPrimaryKeyFields = (schemaDesc) => {
  const result = [];
  if (schemaDesc.type === 'object') {
    result.push(...Object
      .getOwnPropertyNames(schemaDesc.children)
      .filter(fieldName => utils.isPkField(schemaDesc.children[fieldName])));
    Object
      .getOwnPropertyNames(schemaDesc.children)
      .forEach((fieldName) => {
        result.push(...getPrimaryKeyFields(schemaDesc.children[fieldName]));
      });
  } else if ((schemaDesc.type === 'array')
    && schemaDesc.items && schemaDesc.items.length) {
    result.push(...getPrimaryKeyFields(schemaDesc.items[0]));
  }
  return result;
};

const sortKeys = (schema) => {
  const schemaDesc = schema.describe ? schema.describe() : schema;
  const priorityFields = ['name'];
  priorityFields.push(...getPrimaryKeyFields(schemaDesc)
    .sort((a, b) => a.localeCompare(b)));
  const sortFunc = (x, y) => {
    const xIndex = priorityFields.indexOf(x);
    const yIndex = priorityFields.indexOf(y);
    if (xIndex === yIndex) {
      // either same field name, or neither is a priority field
      // so fall back to alpha sort
      return x.localeCompare(y);
    }
    if ((xIndex === -1) && (yIndex !== -1)) {
      return 1;
    }
    if ((yIndex === -1) && (xIndex !== -1)) {
      return -1;
    }
    return xIndex - yIndex;
  };
  return sortFunc;
};

export default sortKeys;
