import Boom from 'boom';
import path from 'path';
import fs from 'fs';
import util from 'util';
import readdir from 'recursive-readdir';
import yaml from 'js-yaml';
import {
  validateData,
} from 'hermetic-common';
import sandboxUtils from '../sandboxUtils';
import config from '../config';
import fileUtil from '../fileUtil';

const validate = async (sandboxName, payload, logger) => {
  if (!await sandboxUtils.sandboxExists(sandboxName)) {
    return Boom.notFound(`Sandbox not found ${sandboxName}`);
  }
  try {
    validateData.validate(payload);
    logger.debug(`Validation OK "${sandboxName}"`);
  } catch (e) {
    if (e instanceof validateData.ValidationError) {
      logger.warn(`Validation Failed "${sandboxName}"`, e.message);
      return Boom.badRequest(e.message);
    }
    throw e;
  }
  return null;
};

const getYaml = async (filepath) => {
  const data = await util.promisify(fs.readFile)(filepath);
  return yaml.safeLoad(data);
};

const getSandboxDatasets = async (sandboxName) => {
  const sandboxPath = path.join(config.sandboxBasePath, sandboxName);
  let paths = await util.promisify(readdir)(sandboxPath);
  paths = paths.filter(p => p.endsWith('.yaml'));
  const datasets = await Promise.all(paths.map(async (p) => {
    const data = await getYaml(p);
    return {
      data,
      filePath: p,
    };
  }));
  return datasets;
};

const saveData = async (payload, sandboxName, logger) => {
  logger.debug(`Saving sandbox model "${sandboxName}"`);
  const validationError = await validate(sandboxName, payload, logger);
  if (validationError) {
    return validationError;
  }
  const oldDatasets = await getSandboxDatasets(sandboxName);
  const newDatasets = [];
  Object.getOwnPropertyNames(payload).forEach((fieldName) => {
    const oldDataset = oldDatasets.find(ds => Object
      .getOwnPropertyNames(ds.data).includes(fieldName));
    let filePath = oldDataset ? oldDataset.filePath : null;
    if (!filePath) {
      filePath = path
        .join(config.sandboxBasePath, sandboxName, `${fieldName}.yaml`);
    }
    let newDataset = newDatasets.find(ds => ds.filePath === filePath);
    if (!newDataset) {
      newDataset = {
        filePath: filePath,
        data: {},
      };
      newDatasets.push(newDataset);
    }
    newDataset.data[fieldName] = payload[fieldName];
  });
  await Promise.all(newDatasets.map(ds => fileUtil
    .writeYaml(ds.filePath, ds.data)));
  const filesToDelete = oldDatasets
    .filter(ods => !newDatasets.find(nds => nds.filePath === ods.filePath))
    .map(ods => ods.filePath);
  await Promise.all(filesToDelete.map(f => util.promisify(fs.unlink)(f)));
  return { saved: sandboxName };
};

export default saveData;
