import { join, resolve } from 'node:path';
import { command } from 'cmd-ts';
import {
  configFilename,
  safeFindConfigFilePath,
  writeConfigFile,
} from '../utils/configFile';
import { packageVersion } from '../utils/packageVersion';

export default command({
  name: 'init',
  description: `Initialize a config file (${configFilename})`,
  args: {},
  handler: async () => {
    const existingPath = await safeFindConfigFilePath();

    if (existingPath) {
      throw new Error(`Config file already exists: ${existingPath}`);
    }

    const path = join(resolve(), configFilename);

    await writeConfigFile(
      {
        $schema: `https://unpkg.com/kavo@${packageVersion}/schemas/config.json`,
        keyring: '',
        recipients: { type: 'all' },
        files: [],
      },
      path,
    );
  },
});
