import schema from './schema';
import utils from './utils';

const mergeObjectArray = (a, b, treeSchema) => {
  const itemSchema = treeSchema.items[0];

  const pks = utils.getPrimaryKeyFieldNames(itemSchema);
  if (!pks.length) {
    // no PKs defined so just do a join of the arrays
    a.push(...b);
  } else {
    b.forEach((bItem) => {
      const aItem = a.find(match => pks
        .every(pk => match[pk] === bItem[pk]));
      if (!aItem) {
        // no matching item in "a" list, so append "b" item
        a.push(bItem);
      } else {
        // eslint-disable-next-line no-use-before-define
        mergeTree(aItem, bItem, treeSchema.items[0]);
      }
    });
  }
};

const mergeObject = (a, b, treeSchema) => {
  const fields = Object.getOwnPropertyNames(treeSchema.children)
    .map(key => (
      {
        fieldName: key,
        schema: treeSchema.children[key],
      }))
    .filter(field => Object.getOwnPropertyNames(a).includes(field.fieldName)
      || Object.getOwnPropertyNames(b).includes(field.fieldName));

  fields.forEach((field) => {
    if (Object.getOwnPropertyNames(a).includes(field.fieldName)
      !== Object.getOwnPropertyNames(b).includes(field.fieldName)) {
      // only one side has the property, so just take the value that exists
      // eslint-disable-next-line no-param-reassign
      a[field.fieldName] = b[field.fieldName] || a[field.fieldName];
    } else if ((field.schema.type === 'array') || (field.schema.type === 'object')) {
      // eslint-disable-next-line no-use-before-define
      mergeTree(a[field.fieldName], b[field.fieldName], field.schema);
    } else {
      // probably a simple string / number etc. field so just let b override a
      // eslint-disable-next-line no-param-reassign
      a[field.fieldName] = b[field.fieldName];
    }
  });
};

const mergeSimpleArray = (a, b) => {
  b.forEach((bItem) => {
    if (!a.includes(bItem)) {
      a.push(bItem);
    }
  });
};

const mergeTree = (a, b, treeSchema) => {
  if ((treeSchema.type === 'array')
    && (treeSchema.items.length === 1)) {
    if (treeSchema.items[0].type === 'object') {
      mergeObjectArray(a, b, treeSchema);
    } else if (treeSchema.items[0].type !== 'array') {
      // assuming an array of simple type, e.g. string
      mergeSimpleArray(a, b);
    }
  } else if (treeSchema.type === 'object') {
    mergeObject(a, b, treeSchema);
  }
};

const mergeData = (datasets) => {
  const schemaFields = schema.describe().children;
  const combined = {};
  datasets.forEach((dataset) => {
    Object.getOwnPropertyNames(dataset).forEach((key) => {
      if (!Object.keys(combined).includes(key)) {
        combined[key] = dataset[key];
      } else {
        mergeTree(combined[key], dataset[key], schemaFields[key]);
      }
    });
  });
  return combined;
};

export default mergeData;
