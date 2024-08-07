import {} from 'node:fs';
import { dirname, relative } from 'node:path';
import { command, positional } from 'cmd-ts';
import { sortedUniq } from 'lodash-es';
import { File } from '../../utils/File';
import { configFile } from '../../utils/configFile';
import { encryptFileAndWrite } from '../../utils/encryption';

export default command({
  name: 'files:add',
  description:
    'Add a new file to the list of secrets files to manage and encrypt it',
  args: {
    path: positional({
      type: File,
      displayName:
        'Path of the secrets file to encode and add to the config file',
    }),
  },
  handler: async ({ path }) => {
    const [config, write, configPath] = await configFile();

    const normalizedPath = relative(dirname(configPath), path);

    config.files = sortedUniq([...config.files, normalizedPath]);

    await write(config);
    await encryptFileAndWrite(path);
  },
});
