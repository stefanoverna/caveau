import { writeFile } from 'node:fs/promises';
import { boolean, command, flag, positional } from 'cmd-ts';
import openEditor from 'open-editor';
import { temporaryFileTask } from 'tempy';
import { ResolvedPath } from '../../utils/File';
import {
  decryptFileAndWrite,
  processAndMaybeReEncryptFile,
} from '../../utils/encryption';
import { confirm, privateKey } from '../../utils/prompt';
import { readFile } from '../../utils/readWrite';

export default command({
  name: 'files:edit',
  description: 'Open a file editor to change the contents, and re-encrypt it',
  args: {
    path: positional({
      type: ResolvedPath,
      displayName: 'Path of the secret file to edit',
    }),
    privateKey,
    decrypt: flag({
      type: boolean,
      short: 'd',
      long: 'decrypt',
      description:
        'Should the decrypted version of the file also be updated after the edit?',
    }),
  },
  handler: async ({ path, privateKey, decrypt }) => {
    const changed = await processAndMaybeReEncryptFile(
      path,
      privateKey,
      async (content) => {
        return await temporaryFileTask(async (temporaryFile) => {
          await writeFile(temporaryFile, content, { encoding: 'utf-8' });
          await openEditor([{ file: temporaryFile }], { wait: true });
          return readFile(temporaryFile);
        });
      },
    );

    if (
      changed &&
      (decrypt || confirm(`Do you also want write the new content in ${path}?`))
    ) {
      decryptFileAndWrite(path, privateKey);
    }
  },
});
