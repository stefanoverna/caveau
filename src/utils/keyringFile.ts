import fetch from 'cross-fetch';
import * as v from 'valibot';
import { type ConfigFile, configFile } from './configFile';

const KeyringFileSchema = v.object({
  $schema: v.optional(v.pipe(v.string(), v.url())),
  publicKeys: v.objectWithRest({}, v.pipe(v.string(), v.startsWith('age'))),
  teams: v.optional(v.objectWithRest({}, v.array(v.string()))),
});

export type KeyringFile = v.InferOutput<typeof KeyringFileSchema>;

export async function keyringFile(): Promise<KeyringFile> {
  const [config] = await configFile();
  const response = await fetch(config.keyring);
  const body = await response.json();

  const result = v.safeParse(KeyringFileSchema, body);

  if (!result.success) {
    console.log(v.flatten<typeof KeyringFileSchema>(result.issues));
    throw new Error(`Invalid keyring file: ${config.keyring}`);
  }

  return result.output;
}

function findRecipientIds(
  recipients: Exclude<ConfigFile['recipients'], { type: 'all' }>,
  keyring: KeyringFile,
) {
  let ids = recipients.publicKeyIds || [];

  const teamIds = recipients.teamIds;

  if (teamIds) {
    ids = [
      ...ids,
      ...teamIds.flatMap((teamId) => {
        if (!keyring.teams || !(teamId in keyring.teams)) {
          throw new Error(`No team "${teamId}" found in keyring.`);
        }

        return keyring.teams[teamId];
      }),
    ];
  }

  return ids;
}

export async function recipientPublicKeys() {
  const [config] = await configFile();
  const keyring = await keyringFile();

  const publicKeys =
    config.recipients.type === 'all'
      ? Object.values(keyring.publicKeys)
      : findRecipientIds(config.recipients, keyring).map((id) => {
          if (!(id in keyring.publicKeys)) {
            throw new Error(
              `No public key for recipient "${id}" found in keyring.`,
            );
          }

          return keyring.publicKeys[id];
        });

  if (publicKeys.length === 0) {
    throw new Error('No recipients defined in config file.');
  }

  return publicKeys;
}
