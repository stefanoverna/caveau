import { boolean, command, flag, positional } from 'cmd-ts';
import openEditor from 'open-editor';
import { temporaryFileTask } from 'tempy';
import { File } from '../../utils/File';
import { decryptFileAndWrite, reEncryptFile } from '../../utils/encryption';
import { confirm, privateKey } from '../../utils/prompt';
import { readFile, writeFile } from '../../utils/readWrite';

export default command({
  name: 'files:edit',
  description: 'Open a file editor to change the contents, and re-encrypt it',
  args: {
    path: positional({
      type: File,
      displayName: 'Path of the secret file to edit',
    }),
    privateKey,
    decrypt: flag({
      type: boolean,
      short: 'd',
      long: 'decrypt',
      description: 'Should the file be decrypted after it has been edited?',
    }),
  },
  handler: async ({ path, privateKey, decrypt }) => {
    await reEncryptFile(path, privateKey, async (content) => {
      return await temporaryFileTask(async (temporaryFile) => {
        writeFile(temporaryFile, content);
        await openEditor([{ file: temporaryFile }], { wait: true });
        return readFile(temporaryFile);
      });
    });

    if (
      decrypt ||
      confirm(`Do you also want write the new content in ${path}?`)
    ) {
      decryptFileAndWrite(path, privateKey);
    }
  },
});
