import { dirname, relative } from 'node:path';
import { command, positional } from 'cmd-ts';
import { without } from 'lodash-es';
import { File } from '../../utils/File';
import { configFile } from '../../utils/configFile';

export default command({
  name: 'files:remove',
  description: 'Removes a file from the list of secrets files to manage',
  args: {
    path: positional({
      type: File,
      displayName: 'Path of the file to remove',
    }),
  },
  handler: async ({ path }) => {
    const [config, write, configPath] = await configFile();

    const normalizedPath = relative(dirname(configPath), path);

    config.files = without(config.files, normalizedPath);

    write(config);
  },
});
