import yaml from 'js-yaml';
import fs from 'fs';
import util from 'util';
import readdir from 'recursive-readdir';
import { schema, sortKeys } from 'hermetic-common';

const getYaml = async (filepath) => {
  const data = await util.promisify(fs.readFile)(filepath);
  return yaml.safeLoad(data);
};

const writeYaml = async (filepath, data) => {
  const sort = sortKeys(schema);
  const yamlData = yaml.safeDump(data, { noRefs: true, sortKeys: sort });
  await util.promisify(fs.writeFile)(filepath, yamlData);
};

const getPaths = async (baseDirs, verbose) => {
  const filePaths = [];
  for (let i = 0; i < baseDirs.length; i += 1) {
    const baseDir = baseDirs[i];
    // eslint-disable-next-line no-await-in-loop
    const exists = await util.promisify(fs.exists)(baseDir);
    if (!exists) {
      throw new Error(`Could not find directory ${baseDir}`);
    }
    // eslint-disable-next-line no-await-in-loop
    const paths = await util.promisify(readdir)(baseDir);
    filePaths.push(...paths.filter(p => p.endsWith('.yaml')));
  }
  if (verbose) {
    // eslint-disable-next-line no-console
    console.log('Processing files', filePaths);
  }
  return filePaths;
};

export default {
  getYaml,
  writeYaml,
  getPaths,
};
