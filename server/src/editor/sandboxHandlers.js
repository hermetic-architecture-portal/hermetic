import Boom from 'boom';
import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';
import copy from 'recursive-copy';
import util from 'util';
import git from 'simple-git/promise';
import config from '../config';
import sandboxUtils from '../sandboxUtils';

const sandboxIsRepo = sandbox => util.promisify(fs.exists)(path
  .join(config.sandboxBasePath, sandbox, '.git'));

const getSandboxes = async () => {
  if (!config.sandboxBasePath) {
    return [];
  }
  const sandboxes = await sandboxUtils.getSandboxes();
  const result = await Promise.all(sandboxes.sandboxes
    .map(async (sandbox) => {
      const isGit = await sandboxIsRepo(sandbox);
      return {
        sandbox,
        isGit,
      };
    }));
  return result;
};

const createSandbox = async (sandboxName, logger) => {
  const sandboxPath = path.join(config.sandboxBasePath, sandboxName);
  logger.debug(`Creating sandbox "${sandboxPath}"`);
  if (await sandboxUtils.sandboxExists(sandboxName)) {
    return Boom.badRequest(`Sandbox already exists "${sandboxName}"`);
  }
  // not using fs-extra for recursive directory copy because of
  // https://github.com/jprichardson/node-fs-extra/issues/629
  await copy(config.baseYamlPath, sandboxPath, {
    expand: true,
    dot: true,
  });
  return {
    created: sandboxName,
  };
};

const deleteSandbox = async (sandboxName, logger) => {
  const sandboxPath = path.join(config.sandboxBasePath, sandboxName);
  logger.debug(`Deleing sandbox "${sandboxPath}"`);
  if (!await sandboxUtils.sandboxExists(sandboxName)) {
    return Boom.badRequest(`Sandbox does not exist "${sandboxName}"`);
  }
  await fsExtra.remove(sandboxPath);
  return {
    deleted: sandboxName,
  };
};

const publishSandbox = async (sandboxName, comment, credentials, logger) => {
  logger.debug(`Publishing sandbox "${sandboxName}`);
  if (!await sandboxUtils.sandboxExists(sandboxName)) {
    return Boom.notFound(`Sandbox not found ${sandboxName}`);
  }
  if (!await sandboxIsRepo(sandboxName)) {
    return Boom.badRequest(`Sandbox is not a git repository ${sandboxName}`);
  }
  const repoPath = path.join(config.sandboxBasePath, sandboxName);
  const repo = git(repoPath);
  await repo.fetch();
  const status = await repo.status();
  let currentBranch = status.current;
  if (!currentBranch.startsWith('sandbox/')) {
    const now = new Date();
    currentBranch = `sandbox/${sandboxName}-${now.getFullYear()}${now.getMonth()}${now.getDate()}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
    await repo.checkoutLocalBranch(currentBranch);
  }
  await repo.add('.');
  const username = credentials ? credentials.username : 'guest';
  const fullComment = `${username}:\n${comment}`;
  await repo.commit(fullComment);
  await repo.push('origin', currentBranch);
  return { branch: currentBranch };
};

export default {
  createSandbox,
  deleteSandbox,
  publishSandbox,
  getSandboxes,
};
