/* eslint-disable no-console */

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import cache from '../src/cache';

if (process.argv.length < 3) {
  console.log('Usage: validate.sh <directoriesToValidate>');
  console.log('directoriesToValidate is a colon delimited list of directories to validate');
  process.exit(1);
}

const dirs = process.argv[2];

let timeout;

const validate = async () => {
  // eslint-disable-next-line no-console
  console.log(`Validating ${dirs}`);
  try {
    await cache(dirs);
    // eslint-disable-next-line no-console
    console.log(chalk.green('OK'));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(chalk.red(e.message));
  }
  // eslint-disable-next-line no-console
  console.log('Watching for file changes...');
  timeout = false;
};

const fileChange = () => {
  if (!timeout) {
    timeout = setTimeout(validate, 300);
  }
};

dirs.split(':').forEach((dir) => {
  const exists = fs.existsSync(dir);
  if (!exists) {
    // eslint-disable-next-line no-console
    console.error(chalk.red(`Could not find directory ${dir}`));
    process.exit(1);
  }

  const fullPath = path.resolve(dir);

  const watcher = chokidar.watch(fullPath, { ignored: /(^|[\/\\])\../ });

  watcher.on('ready', () => {
    fileChange();
    watcher.on('all', fileChange);
  });
});

console.log('Press any key to exit');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));
