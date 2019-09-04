const isPkField = fieldSchemaDesc => fieldSchemaDesc.rules
  && fieldSchemaDesc.rules
    .some(r => r.name === 'pk');

const getPrimaryKeyFieldNames = schemaDesc => Object
  .getOwnPropertyNames(schemaDesc.children)
  .filter(fieldName => isPkField(schemaDesc.children[fieldName]));

export default {
  isPkField,
  getPrimaryKeyFieldNames,
};
