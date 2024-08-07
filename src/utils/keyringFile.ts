import fetch from 'cross-fetch';
import * as v from 'valibot';
import { configFile } from './configFile';

const KeyringFileSchema = v.object({
  $schema: v.optional(v.pipe(v.string(), v.url())),
  publicKeys: v.objectWithRest({}, v.pipe(v.string(), v.startsWith('age'))),
});

export type KeyringFile = v.InferOutput<typeof KeyringFileSchema>;

export async function keyringFile() {
  const [config] = await configFile();
  const response = await fetch(config.keyring);
  const body = await response.json();
  return parseKeyringFile(body);
}

export function parseKeyringFile(data: unknown): KeyringFile {
  const result = v.safeParse(KeyringFileSchema, data);
  if (!result.success) {
    console.log(v.flatten<typeof KeyringFileSchema>(result.issues));
    throw new Error('Invalid config file.');
  }

  return result.output;
}

export async function recipientPublicKeys() {
  const [config] = await configFile();
  const keyring = await keyringFile();

  const publicKeys =
    config.recipients.type === 'all'
      ? Object.values(keyring.publicKeys)
      : config.recipients.ids.map((id) => {
          if (!(id in keyring)) {
            throw new Error(
              `No public key for recipient "${id}" found in keyring`,
            );
          }

          return keyring.publicKeys[id];
        });

  if (publicKeys.length === 0) {
    throw new Error('No recipients defined in config file');
  }

  return publicKeys;
}
