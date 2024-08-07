import { existsSync } from 'node:fs';
import age from 'age-encryption';
import { boolean, command, flag } from 'cmd-ts';
import {
  confirm,
  privateKeyFilePath,
  privateKeyFilename,
} from '../../utils/prompt';
import { writeFile } from '../../utils/readWrite';

export default command({
  name: 'keys:generate',
  description: 'Generates a new pair of private and public keys',
  args: {
    savePrivateKey: flag({
      type: boolean,
      short: 's',
      long: 'save-private-key',
      description: `Should the private key be saved in ~/${privateKeyFilename}?`,
    }),
  },
  handler: async ({ savePrivateKey }) => {
    const { generateIdentity, identityToRecipient } = await age();

    const privateKey = generateIdentity();
    const publicKey = identityToRecipient(privateKey);

    console.log('=== Public key (to be added to keyring) ===');
    console.log(publicKey);
    console.log();
    console.log('=== Private key (NEVER SHARE TO ANYONE, KEEP IT SAFE!) ===');
    console.log(privateKey);

    if (
      privateKeyFilePath &&
      (savePrivateKey ||
        confirm(
          `Do you wish to save your private key in ~/${privateKeyFilename}?`,
        ))
    ) {
      if (existsSync(privateKeyFilePath)) {
        throw new Error(`File ~/${privateKeyFilename} already exists.`);
      }

      writeFile(privateKeyFilePath, privateKey);
    }
  },
});
