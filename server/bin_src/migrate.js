/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import path from 'path';
import chalk from 'chalk';
import { merge } from 'hermetic-common';
import fileUtil from '../src/fileUtil';
import migrations from './migrations';

if (process.argv.length < 4) {
  console.log('Usage: migrate.sh <sourceDirectory> <destDirectory>');
  process.exit(1);
}

const sourceDir = process.argv[2];
const destDir = process.argv[3];

const main = async () => {
  try {
    if (sourceDir === destDir) {
      throw new Error('In place migration is not supported');
    }
    const paths = await fileUtil.getPaths([sourceDir], true);
    const datasets = await Promise.all(paths.map(async (p) => {
      const data = await fileUtil.getYaml(p);
      const destPath = path.join(destDir, path.basename(p));
      return {
        sourcePath: p,
        destPath,
        data,
      };
    }));

    const data = merge(datasets.map(ds => ds.data));

    migrations.forEach(m => m(data));

    const newDatasets = [];
    Object.getOwnPropertyNames(data).forEach((fieldName) => {
      const oldDataset = datasets.find(ds => Object
        .getOwnPropertyNames(ds.data).includes(fieldName));
      let destPath = oldDataset ? oldDataset.destPath : null;
      if (!destPath) {
        destPath = path.join(destDir, `${fieldName}.yaml`);
      }
      let newDataset = newDatasets.find(ds => ds.destPath === destPath);
      if (!newDataset) {
        newDataset = {
          destPath,
          data: {},
        };
        newDatasets.push(newDataset);
      }
      newDataset.data[fieldName] = data[fieldName];
    });
    await Promise.all(newDatasets.map(ds => fileUtil.writeYaml(ds.destPath, ds.data)));
    console.error(chalk.green('Data has been migrated.  Please validate with validate.sh'));
  } catch (e) {
    console.error(chalk.red(e.message));
    process.exit(1);
  }
};

main();
