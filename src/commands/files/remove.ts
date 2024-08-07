import { dirname, relative } from 'node:path';
import { command, restPositionals } from 'cmd-ts';
import { without } from 'lodash-es';
import { ResolvedPath } from '../../utils/File';
import { configFile } from '../../utils/configFile';
import { deleteFile } from '../../utils/readWrite';

export default command({
  name: 'files:remove',
  description:
    'Removes a file from the list of secrets files to manage, and deletes the encrypted version',
  args: {
    paths: restPositionals({
      type: ResolvedPath,
      displayName: 'Path of the file to remove',
    }),
  },
  handler: async ({ paths }) => {
    const [config, write, configPath] = await configFile();

    for (const path of paths) {
      const normalizedPath = relative(dirname(configPath), path);
      config.files = without(config.files, normalizedPath);
      deleteFile(`${path}.enc`);
    }

    write(config);
  },
});
