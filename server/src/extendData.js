const extendData = (result, entityData, entityName, featureName, fullData) => {
  const extensionFields = {};
  // eslint-disable-next-line no-param-reassign
  result.extensionFields = extensionFields;
  if (!fullData.extensionFields) {
    return;
  }
  const relevantExtensionFields = fullData.extensionFields
    .filter(ef => ef.entity === entityName)
    .filter(ef => ef.requiredFeature === featureName);

  relevantExtensionFields.forEach((ef) => {
    extensionFields[ef.displayName] = entityData[ef.fieldName];
  });
};

export default extendData;
