import util from 'util';
import fs from 'fs';
import path from 'path';

const sandboxUtils = {
  getSandboxes: async (sandboxBasePath) => {
    const files = await util.promisify(fs.readdir)(sandboxBasePath);
    const directories = [];
    for (let i = 0; i < files.length; i += 1) {
      const filePath = path.join(sandboxBasePath, files[i]);
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

  sandboxExists: async (sandboxBasePath, sandboxName) => {
    const sandboxes = await sandboxUtils.getSandboxes(sandboxBasePath);
    const sandbox = sandboxes.sandboxes.find(s => s === sandboxName);
    return !!sandbox;
  },
};

export default sandboxUtils;
