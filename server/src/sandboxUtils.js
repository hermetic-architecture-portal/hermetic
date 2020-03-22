import util from 'util';
import fs from 'fs';
import path from 'path';
import config from './config';

const sandboxUtils = {
  getSandboxes: async () => {
    const files = await util.promisify(fs.readdir)(config.sandboxBasePath);
    const directories = [];
    for (let i = 0; i < files.length; i += 1) {
      const filePath = path.join(config.sandboxBasePath, files[i]);
      // eslint-disable-next-line no-await-in-loop
      const stat = await util.promisify(fs.stat)(filePath);
      if (stat.isDirectory) {
        directories.push(files[i]);
      }
    }
    return {
      sandboxes: directories,
    };
  },

  sandboxExists: async (sandboxName) => {
    const sandboxes = await sandboxUtils.getSandboxes();
    const sandbox = sandboxes.sandboxes.find(s => s === sandboxName);
    return !!sandbox;
  },
};

export default sandboxUtils;
