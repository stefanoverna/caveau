import { dirname, relative } from 'node:path';
import { command, positional } from 'cmd-ts';
import ignore from 'ignore';
import { sortedUniq } from 'lodash-es';
import { File } from '../../utils/File';
import { configFile } from '../../utils/configFile';
import { encryptFileAndWrite } from '../../utils/encryption';
import { safeFindNearestFile } from '../../utils/findNearestFile';
import { readFile } from '../../utils/readWrite';

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

    const relativePathToConfigPath = relative(dirname(configPath), path);
    const relativePathToCwd = relative(process.cwd(), path);

    config.files = sortedUniq([...config.files, relativePathToConfigPath]);

    await write(config);
    await encryptFileAndWrite(path);

    const gitIgnorePath = await safeFindNearestFile('.gitignore');
    if (gitIgnorePath) {
      const gitIgnore = ignore().add(readFile(gitIgnorePath));

      const relativePathForGitIgnore = relative(dirname(gitIgnorePath), path);

      if (!gitIgnore.ignores(relativePathForGitIgnore)) {
        console.log();
        console.log(
          `WARNING: ${relativePathToCwd} is NOT excluded by .gitignore!`,
        );
      }
    }
  },
});
