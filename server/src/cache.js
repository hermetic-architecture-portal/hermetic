import fs from 'fs';
import path from 'path';
import util from 'util';
import clone from 'clone-deep';
import { validateData, merge } from 'hermetic-common';
import sandboxUtils from './sandboxUtils';
import config from './config';
import fileUtil from './fileUtil';

const cacheController = {
  caches: [],

  getCache: (sandbox) => {
    const currentTimestamp = Date.now();
    cacheController.caches = cacheController.caches
      .filter(cache => (!cache.sandbox) // never dump the non-sandbox cache
      || ((currentTimestamp - cache.lastUsed) < 60000) // dump if old
      || cache.loadingPromise); // don't dump if loading right now
    let cache = cacheController.caches.find(c => c.sandbox === sandbox);
    if (!cache) {
      cache = {
        sandbox,
        loadingPromise: false,
        data: false,
        dates: [],
      };
      cacheController.caches.push(cache);
    }
    cache.lastUsed = currentTimestamp;
    return cache;
  },
};

const isModified = (oldDates, newDates) => {
  if (oldDates.length !== newDates.length) {
    return true;
  }
  return oldDates.some((oldDate, index) => (
    (oldDate.filePath !== newDates[index].filePath)
    || (oldDate.modified !== newDates[index].modified)
  ));
};

const getStats = async (filepath) => {
  const stats = await util.promisify(fs.stat)(filepath);
  return {
    filepath,
    modified: stats.mtimeMs,
  };
};

const loadAllFiles = async (paths, fileDates, cache) => {
  try {
    const data = await Promise.all(paths.map(p => fileUtil.getYaml(p)));
    const combined = merge(data);
    validateData.validate(combined);
    // eslint-disable-next-line no-param-reassign
    cache.loadingPromise = false;
    // eslint-disable-next-line no-param-reassign
    cache.dates = fileDates;
    // eslint-disable-next-line no-param-reassign
    cache.data = combined;
    return combined;
  } catch (e) {
    // eslint-disable-next-line no-param-reassign
    cache.loadingPromise = false;
    throw e;
  }
};

const load = async (dirs, verbose, sandbox, forEditor) => {
  let baseDirs = (dirs || config.baseYamlPath).split(':');
  if (sandbox) {
    const exists = await sandboxUtils.sandboxExists(sandbox);
    if (!exists) {
      throw new Error(`Sandbox "${sandbox}" does not exist`);
    }
    if (forEditor) {
      // the editing interface should only see the sandbox directory
      // data as we don't know how to split out data into multiple
      // directories at save time.
      baseDirs = [];
    } else {
      // if there are multiple base data directories, the first
      // will be the basis for the sandbox, and the 2nd+ will
      // need to be merged in to see the result
      baseDirs = baseDirs.slice(1);
    }
    baseDirs.push(path.join(config.sandboxBasePath, sandbox));
  }
  const filePaths = await fileUtil.getPaths(baseDirs, verbose);
  let fileDates = await Promise.all(filePaths.map(p => getStats(p)));
  fileDates = fileDates.sort((a, b) => a.filepath.localeCompare(b.filePath));
  const cache = cacheController.getCache(sandbox);
  if (!isModified(cache.dates, fileDates)) {
    return clone(cache.data);
  }
  // cache is out of date - see if someone else is
  // already refreshing it
  if (!cache.loadingPromise) {
    cache.loadingPromise = loadAllFiles(filePaths, fileDates, cache);
  }
  await cache.loadingPromise;
  // clone to prevent cache being poluted by data modifications
  // in API handlers
  return clone(cache.data);
};

export default load;
