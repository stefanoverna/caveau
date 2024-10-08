import { dirname, resolve } from 'node:path';
import { boolean, command, flag, restPositionals } from 'cmd-ts';
import { ResolvedPath } from '../../utils/File';
import { configFile } from '../../utils/configFile';
import { decryptFile, decryptFileAndWrite } from '../../utils/encryption';
import { privateKey } from '../../utils/prompt';

export default command({
  name: 'files:decrypt',
  description: 'Decrypt all secret files (or a specific one)',
  args: {
    explicitPaths: restPositionals({
      type: ResolvedPath,
      displayName: 'Paths of the secret files to decrypt',
    }),
    privateKey,
    toStdout: flag({
      type: boolean,
      short: 'o',
      long: 'stdout',
      description: 'Should the decrypted content be written to stdout instead?',
    }),
  },
  handler: async ({ explicitPaths, privateKey, toStdout }) => {
    const [config, _, configFilePath] = await configFile();

    const paths =
      explicitPaths.length > 0
        ? explicitPaths
        : config.files.map((path) => resolve(dirname(configFilePath), path));

    for (const file of paths) {
      if (toStdout) {
        console.log(await decryptFile(file, privateKey));
      } else {
        await decryptFileAndWrite(file, privateKey);
      }
    }
  },
});
