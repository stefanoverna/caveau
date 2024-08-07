import { command, restPositionals } from 'cmd-ts';
import { File } from '../../utils/File';
import { configFile } from '../../utils/configFile';
import { decryptFileAndWrite } from '../../utils/encryption';
import { privateKey } from '../../utils/prompt';

export default command({
  name: 'files:decrypt',
  description: 'Decrypt all secret files (or a specific one)',
  args: {
    explicitPaths: restPositionals({
      type: File,
      displayName: 'Paths of the secrets files to decrypt',
    }),
    privateKey,
  },
  handler: async ({ explicitPaths, privateKey }) => {
    const [config] = await configFile();

    const paths = explicitPaths.length > 0 ? explicitPaths : config.files;

    for (const file of paths) {
      await decryptFileAndWrite(file, privateKey);
    }
  },
});
