import Boom from 'boom';
import path from 'path';
import fs from 'fs';
import util from 'util';
import readdir from 'recursive-readdir';
import yaml from 'js-yaml';
import git from 'simple-git/promise';
import {
  validateData,
} from 'hermetic-common';
import sandboxUtils from '../sandboxUtils';
import config from '../config';
import fileUtil from '../fileUtil';

const effectiveSandboxName = sandboxName => (config.liveEditing ? 'LIVE' : sandboxName);

const validate = async (sandboxName, payload, logger) => {
  if (!config.liveEditing) {
    if (!await sandboxUtils.sandboxExists(sandboxName)) {
      return Boom.notFound(`Sandbox not found ${sandboxName}`);
    }
  }
  try {
    validateData.validate(payload);
    logger.debug(`Validation OK "${effectiveSandboxName(sandboxName)}"`);
  } catch (e) {
    if (e instanceof validateData.ValidationError) {
      logger.warn(`Validation Failed "${effectiveSandboxName(sandboxName)}"`, e.message);
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
  let paths;
  if (config.liveEditing) {
    const basePaths = config.baseYamlPath.split(':');
    const subPaths = await Promise
      .all(basePaths.map(p => util.promisify(readdir)(p)));
    paths = [];
    subPaths.forEach((subPath) => {
      paths.push(...subPath);
    });
  } else {
    const sandboxPath = path.join(config.sandboxBasePath, sandboxName);
    paths = await util.promisify(readdir)(sandboxPath);
  }
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

const commitOneFolder = async (username, logger, filepath) => {
  logger.debug(`Committing folder ${filepath} for ${username}`);
  const isGit = await util.promisify(fs.exists)(path.join(filepath, '.git'));
  if (!isGit) {
    logger.debug(`${filepath} is not a git repo - skipping commit`);
    return;
  }
  const comment = `Changes for ${username}`;
  const repo = git(filepath);
  const status = await repo.status();
  if (status.isClean()) {
    logger.debug(`${filepath} has no changes - skipping commit`);
    return;
  }
  const log = await repo.log({ '-1': null });
  const previousMessage = log.latest.message;
  const previousDate = new Date(log.latest.date);
  const secondsSincePrevious = ((new Date()) - previousDate) / 1000;
  // changes are saved entity by entity
  // and we'd rather have a commit per batch of changes
  // than per entity change, so try to batch them together
  const isBatchContinuation = (previousMessage === comment)
    && secondsSincePrevious < 300;
  repo.add('.');
  await repo.commit(comment);
  if (isBatchContinuation) {
    logger.debug('rebasing...');
    await repo.reset(['--soft', 'HEAD~2']);
    await repo.commit(comment);
  }
  await repo.push(['--force']);
};

const commit = async (username, logger) => {
  const paths = config.baseYamlPath.split(':');
  await Promise
    .all(paths.map(p => commitOneFolder(username, logger, p)));
};

const saveData = async (payload, sandboxName, logger, credentials) => {
  const username = credentials ? credentials.username : 'guest';
  logger.debug(`Saving sandbox model "${effectiveSandboxName(sandboxName)}" for ${username}`);
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
      if (config.liveEditing) {
        filePath = path
          .join(config.baseYamlPath.split(':')[0], `${fieldName}.yaml`);
      } else {
        filePath = path
          .join(config.sandboxBasePath, sandboxName, `${fieldName}.yaml`);
      }
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
  if (config.liveEditing) {
    await commit(username, logger);
  }
  return { saved: sandboxName };
};

export default saveData;
