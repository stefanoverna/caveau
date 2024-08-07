import { join, resolve } from 'node:path';
import { command } from 'cmd-ts';
import {
  configFilename,
  findConfigFilePath,
  writeConfigFile,
} from '../utils/configFile';
import { packageVersion } from '../utils/packageVersion';

class ConfigFileAlreadyExists extends Error {}

export default command({
  name: 'init',
  description: `Initialize a config file (${configFilename})`,
  args: {},
  handler: async () => {
    try {
      const path = await findConfigFilePath();
      throw new ConfigFileAlreadyExists(
        `Configuration file already exists at ${path}`,
      );
    } catch (e) {
      if (e instanceof ConfigFileAlreadyExists) {
        throw e;
      }

      const path = join(resolve(), configFilename);

      await writeConfigFile(
        {
          $schema: `https://unpkg.com/caveau@${packageVersion}/schemas/config.json`,
          keyring: '',
          recipients: { type: 'all' },
          files: [],
        },
        path,
      );
    }
  },
});
