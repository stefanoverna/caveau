import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { command } from 'cmd-ts';
import {
  configFilename,
  findConfigFilePath,
  writeConfigFile,
} from '../utils/configFile';
import { readFile } from '../utils/readWrite';

const __filename = fileURLToPath(import.meta.url);
const packageJsonPath = resolve(
  dirname(__filename),
  '..',
  '..',
  'package.json',
);

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

      const version = JSON.parse(readFile(packageJsonPath)).version as string;

      await writeConfigFile(
        {
          $schema: `https://unpkg.com/caveau@${version}/schemas/config.json`,
          keyring: '',
          recipients: { type: 'all' },
          files: [],
        },
        path,
      );
    }
  },
});
