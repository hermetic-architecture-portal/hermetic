import Joi from 'joi';
import Boom from 'boom';
import clone from 'clone-deep';
import utils from './utils';
import page from './page';

const queryValidation = {
  // !!!!!!!!!!!!!!!!!!!!!!!!
  // restricting this to alphanumeric
  // to prevent attempts to break out from sandbox directory
  sandbox: Joi.string().required()
    .alphanum(),
};

const findItem = (data, findItemFunctions, params) => {
  let match = data;
  findItemFunctions.forEach((findItemFunction) => {
    if (match) {
      match = findItemFunction(match, params);
    }
  });
  return match;
};

const findParent = (data, findItemFunctions, params) => findItem(
  data,
  findItemFunctions.filter((item, index) => index < findItemFunctions.length - 1),
  params,
);

const undefIfNoKeys = item => (Object.getOwnPropertyNames(item).length
  ? item : undefined);

const buildGetMultipleItemRoute = (
  validationParams, itemSchema, currentPath, findFunctions, getData, pageSize,
) => ({
  method: 'GET',
  path: currentPath,
  options: {
    validate: {
      query: Object.assign({
        page: Joi.number().optional().default(1),
        filter: Joi.string().optional().empty(),
      }, queryValidation),
      params: undefIfNoKeys(validationParams),
    },
  },
  handler: async (request) => {
    const pageNum = (request.query && request.query.page) ? request.query.page : 1;
    const data = await getData(null, false, request.query && request.query.sandbox);
    const collection = findItem(data, findFunctions, request.params);
    if (!collection) {
      return {
        count: 0,
        page: 1,
        totalPages: 1,
        items: [],
      };
    }
    return page(itemSchema.describe(), collection, pageSize, pageNum, request.query.filter);
  },
});

const buildGetSingleItemRoute = (
  validationParams, currentPath, findFunctions, getData, excludeFieldsFromSave,
) => ({
  method: 'GET',
  path: currentPath,
  options: {
    validate: {
      params: undefIfNoKeys(validationParams),
      query: queryValidation,
    },
  },
  handler: async (request) => {
    const data = await getData(null, false, request.query && request.query.sandbox);
    const match = findItem(data, findFunctions, request.params);
    if (match) {
      const cloned = clone(match);
      excludeFieldsFromSave.forEach((fieldName) => {
        delete cloned[fieldName];
      });
      return cloned;
    }
    return Boom.notFound();
  },
});

const buildPutSingleItemRoute = (
  validationParams, currentPath, findFunctions, getData, setData, excludeFieldsFromSave,
) => ({
  method: 'PUT',
  path: currentPath,
  options: {
    validate: {
      params: undefIfNoKeys(validationParams),
      payload: Joi.object(),
      query: queryValidation,
    },
  },
  handler: async (request) => {
    const data = clone(await getData(null, false, request.query && request.query.sandbox));
    const match = findItem(data, findFunctions, request.params);
    if (!match) {
      return Boom.notFound();
    }
    Object.getOwnPropertyNames(match)
      .filter(fieldName => !excludeFieldsFromSave.includes(fieldName))
      .forEach((fieldName) => {
        delete match[fieldName];
      });

    Object.getOwnPropertyNames(request.payload)
      .filter(fieldName => !excludeFieldsFromSave.includes(fieldName))
      .forEach((fieldName) => {
        match[fieldName] = request.payload[fieldName];
      });
    return setData(data, request.query && request.query.sandbox,
      request.plugins && request.plugins.logger);
  },
});

const buildDeleteSingleItemRoute = (
  validationParams, currentPath, findFunctions, getData, setData,
) => ({
  method: 'DELETE',
  path: currentPath,
  options: {
    validate: {
      params: undefIfNoKeys(validationParams),
      query: queryValidation,
    },
  },
  handler: async (request) => {
    const data = clone(await getData(null, false, request.query && request.query.sandbox));
    const match = findItem(data, findFunctions, request.params);
    if (!match) {
      return Boom.notFound();
    }
    const parentCollection = findParent(data, findFunctions, request.params);
    const indexToRemove = parentCollection.indexOf(match);
    parentCollection.splice(indexToRemove, 1);
    return setData(data, request.query && request.query.sandbox,
      request.plugins && request.plugins.logger);
  },
});

const buildPostSingleItemRoute = (
  validationParams, currentPath, findFunctions, getData, setData,
  parentFieldName, excludeFieldsFromSave,
) => ({
  method: 'POST',
  path: currentPath,
  options: {
    validate: {
      params: undefIfNoKeys(validationParams),
      payload: Joi.object(),
      query: queryValidation,
    },
  },
  handler: async (request) => {
    const data = clone(await getData(null, false, request.query && request.query.sandbox));
    let collection = findItem(data, findFunctions, request.params);
    if (!collection) {
      const parent = findParent(data, findFunctions, request.params);
      if (!parent) {
        return Boom.notFound();
      }
      collection = [];
      parent[parentFieldName] = collection;
    }
    const newItem = clone(request.payload);
    excludeFieldsFromSave.forEach((fieldName) => {
      // because sometimes the array is mandatory
      newItem[fieldName] = [];
    });
    collection.push(newItem);
    return setData(data, request.query && request.query.sandbox,
      request.plugins && request.plugins.logger);
  },
});

const buildCRUDRoutes = (
  schema, path, getData, setData, pageSize = 10,
  findItemFunctions, validationParams = {}, parentFieldName,
) => {
  const result = [];
  const schemaDesc = schema.describe();
  if (schemaDesc.type === 'object') {
    Object.getOwnPropertyNames(schemaDesc.children).forEach((fieldName) => {
      const nextPath = `${path}/${encodeURIComponent(fieldName)}`;
      const nextSchema = utils.reach(schema, fieldName);
      // slice so we don't alter the original array
      const nextFindItemFunctions = (findItemFunctions || []).slice();
      nextFindItemFunctions.push(data => data[fieldName]);
      result.push(...buildCRUDRoutes(
        nextSchema, nextPath, getData, setData, pageSize,
        nextFindItemFunctions, validationParams, fieldName,
      ));
    });
  } else if ((schemaDesc.type === 'array')
    && schemaDesc.items
    && schemaDesc.items.length
    && schemaDesc.items[0].type === 'object') {
    const nextSchema = utils.reach(schema, '[]');
    const nextSchemaDesc = nextSchema.describe();

    result.push(buildGetMultipleItemRoute(
      validationParams, nextSchema, path, findItemFunctions, getData, pageSize,
    ));

    const excludeFieldsFromSave = Object.getOwnPropertyNames(nextSchemaDesc.children)
      .filter(fieldName => (nextSchemaDesc.children[fieldName].type === 'array')
        && nextSchemaDesc.children[fieldName].items
        && nextSchemaDesc.children[fieldName].items.length
        && nextSchemaDesc.children[fieldName].items[0].type === 'object');

    result.push(buildPostSingleItemRoute(
      validationParams, path, findItemFunctions, getData, setData, parentFieldName,
      excludeFieldsFromSave,
    ));

    const pkFields = utils.getPrimaryKeyFieldNames(nextSchemaDesc);

    const nextValidationParams = clone(validationParams);

    const paramNames = pkFields.map((fieldName) => {
      const namePair = {
        fieldName,
        paramName: fieldName,
      };
      if (nextValidationParams[fieldName]) {
        // fieldName is used higher up the tree - deduplicate it
        namePair.paramName = `${parentFieldName}_${fieldName}`;
      }
      return namePair;
    });

    paramNames.forEach((namePair) => {
      if (nextSchemaDesc.children[namePair.fieldName].type === 'string') {
        nextValidationParams[namePair.paramName] = Joi.string();
      } else if (nextSchemaDesc.children[namePair.fieldName].type === 'number') {
        nextValidationParams[namePair.paramName] = Joi.number();
      }
    });
    const pkFieldsPart = paramNames
      .map(namePair => `{${namePair.paramName}}`)
      .join('/');
    const nextPath = `${path}/${pkFieldsPart}`;
    const nextFindItemFunctions = findItemFunctions.slice();
    nextFindItemFunctions.push((data, params) => (data || [])
      .find(item => paramNames
        .every(namePair => (item[namePair.fieldName] === params[namePair.paramName])
        || (
          // pass the string 'null' to match a null or undefined field value
          (params[namePair.paramName] === 'null')
          && (
            (typeof item[namePair.fieldName] === 'undefined')
            || (item[namePair.fieldName] === null)
          )
        ))));

    result.push(
      buildGetSingleItemRoute(nextValidationParams, nextPath, nextFindItemFunctions,
        getData, excludeFieldsFromSave),
    );

    result.push(
      buildPutSingleItemRoute(
        nextValidationParams, nextPath, nextFindItemFunctions,
        getData, setData, excludeFieldsFromSave,
      ),
    );

    result.push(
      buildDeleteSingleItemRoute(
        nextValidationParams, nextPath, nextFindItemFunctions, getData, setData,
      ),
    );

    result.push(...buildCRUDRoutes(
      nextSchema, nextPath, getData, setData, pageSize, nextFindItemFunctions, nextValidationParams,
    ));
  }
  return result;
};

export default buildCRUDRoutes;
