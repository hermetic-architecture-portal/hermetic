import utils from './utils';

const page = (itemSchemaDesc, array, pageSize, pageNumber, filterValue) => {
  if (!array) {
    return {
      items: [],
      totalPages: 1,
      page: Number(pageNumber),
      count: 0,
    };
  }
  const keyFieldNames = utils.getPrimaryKeyFieldNames(itemSchemaDesc);
  const displayNameFieldNames = utils.getDisplayNameFieldNames(itemSchemaDesc);
  if (!displayNameFieldNames.length) {
    throw new Error('No display field');
  }
  const displayFieldName = displayNameFieldNames[0];

  const filteredArray = array
    .filter(x => (!filterValue)
      || (x[displayFieldName].toUpperCase().includes(filterValue.toUpperCase())));

  const sortedArray = filteredArray
    .sort((a, b) => a[displayFieldName].localeCompare(b[displayFieldName]));

  const summaryArray = sortedArray
    .map((x) => {
      const result = {};
      if (itemSchemaDesc.meta && itemSchemaDesc.meta.some(m => m.fullEntityInSummary)) {
        Object.getOwnPropertyNames(itemSchemaDesc.children).forEach((fieldName) => {
          if (itemSchemaDesc.children[fieldName].type !== 'array') {
            result[fieldName] = x[fieldName];
          }
        });
      } else {
        keyFieldNames.forEach((keyFieldName) => {
          result[keyFieldName] = x[keyFieldName];
        });
        displayNameFieldNames.forEach((displayNameFieldName) => {
          result[displayNameFieldName] = x[displayNameFieldName];
        });
      }
      return result;
    });

  const minIndex = (Number(pageNumber) * Number(pageSize)) - Number(pageSize);
  const maxIndex = minIndex + Number(pageSize) - 1;

  let totalPages = Math.ceil(summaryArray.length / Number(pageSize));
  if (totalPages === 0) {
    totalPages = 1;
  }
  return {
    count: summaryArray.length,
    page: Number(pageNumber),
    totalPages,
    items: summaryArray.filter((x, index) => (index >= minIndex) && (index <= maxIndex)),
  };
};

export default page;
