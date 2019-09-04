/* eslint-disable no-console */

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import git from 'simple-git/promise';
import tmp from 'tmp';
import rimraf from 'rimraf';
import cache from '../src/cache';

if (process.argv.length < 3) {
  console.error('Usage: sync.sh <directoryToSynchronise>');
  process.exit(1);
}

const dir = process.argv[2];

if (!fs.existsSync(dir)) {
  console.error(chalk.red(`Could not find directory ${dir}`));
  process.exit(1);
}

if (!fs.existsSync(path.join(dir, '.git'))) {
  console.error(chalk.red(`${dir} is not a git repository`));
  process.exit(1);
}

const tempDir = tmp.dirSync();
const mainRepo = git(dir);
const tempGit = git(tempDir.name);

const main = async () => {
  try {
    await mainRepo.fetch();
    const status = await mainRepo.status();
    if (!status.behind) {
      console.log(chalk.green('Repo is up to date'));
      process.exit(0);
    }
    console.log(`Repo is ${status.behind} commits behind remote`);
    const remote = (await mainRepo.getRemotes(true))
      .find(r => r.name === 'origin');
    if (!remote) {
      throw new Error(`Could not find remote named origin for git repo at ${dir}`);
    }
    const remoteUrl = remote.refs.fetch;
    console.log(`Verifying latest version of remote ${remoteUrl}`);

    await tempGit.clone(remoteUrl, path.join(tempDir.name, 'temp'), { '--depth': 1 });
    // next line would throw if there is a validation error in new version
    await cache(path.join(tempDir.name, 'temp'), true);
    console.log('Latest version verified, replacing current repo');
    fs.renameSync(dir, path.join(tempDir.name, 'trash'));
    fs.renameSync(path.join(tempDir.name, 'temp'), dir);
    rimraf.sync(path.join(tempDir.name, 'trash'));
    rimraf.sync(tempDir.name);
    console.log(chalk.green('Up to date'));
  } catch (e) {
    console.error(chalk.red(e.message));
    rimraf.sync(tempDir.name);
    process.exit(1);
  }
};

main();
