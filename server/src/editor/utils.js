const getPrimaryKeyFieldNames = schemaDesc => Object
  .getOwnPropertyNames(schemaDesc.children)
  .filter(fieldName => schemaDesc.children[fieldName].rules
    && schemaDesc.children[fieldName].rules
      .some(r => r.name === 'pk'));

const getDisplayNameFieldNames = (schemaDesc) => {
  const result = Object
    .getOwnPropertyNames(schemaDesc.children)
    .filter(fieldName => schemaDesc.children[fieldName].meta
      && schemaDesc.children[fieldName].meta
        .some(meta => meta.displayName));
  if (result.length) {
    return result;
  }
  if (Object
    .getOwnPropertyNames(schemaDesc.children)
    .includes('name')) {
    return ['name'];
  }
  return getPrimaryKeyFieldNames(schemaDesc);
};


const nextPath = chunks => chunks
  .filter((item, index) => index > 0)
  .join('.');

const reach = (schema, path) => {
  // have to access Joi internals to traverse the object tree
  // as built in Joi.reach does not traverse arrays
  /* eslint-disable no-underscore-dangle */
  const chunks = path.split('.').filter(chunk => !!chunk);
  if (!chunks.length) {
    return schema;
  }
  const currentChunk = chunks[0];
  if (currentChunk === '[]') {
    if (schema._inner.items && schema._inner.items.length) {
      return reach(schema._inner.items[0], nextPath(chunks));
    }
  } else if (schema._inner.children) {
    const childSchema = schema._inner.children.find(c => c.key === currentChunk);
    if (childSchema) {
      return reach(childSchema.schema, nextPath(chunks));
    }
  }
  /* eslint-enable no-underscore-dangle */
  return undefined;
};

export default {
  reach,
  getPrimaryKeyFieldNames,
  getDisplayNameFieldNames,
};
