import * as v from 'valibot';
import { findNearestFile, safeFindNearestFile } from './findNearestFile';
import { readFile, writeFile } from './readWrite';

const ConfigFileSchema = v.object({
  $schema: v.optional(v.pipe(v.string(), v.url())),
  keyring: v.pipe(v.string(), v.url()),
  recipients: v.variant('type', [
    v.object({ type: v.literal('all') }),
    v.object({
      type: v.literal('subset'),
      publicKeyIds: v.optional(v.array(v.string())),
      teamIds: v.optional(v.array(v.string())),
    }),
  ]),
  files: v.array(v.string()),
});

export type ConfigFile = v.InferOutput<typeof ConfigFileSchema>;

export const configFilename = '.caveau.json';

export function safeFindConfigFilePath() {
  return safeFindNearestFile(configFilename);
}

export async function configFile(): Promise<
  [ConfigFile, (data: ConfigFile) => void, string]
> {
  const path = await findNearestFile(configFilename);
  const result = v.safeParse(ConfigFileSchema, JSON.parse(readFile(path)));

  if (!result.success) {
    console.log(v.flatten<typeof ConfigFileSchema>(result.issues));
    throw new Error(`Invalid config file: ${path}`);
  }

  return [
    result.output,
    (data: ConfigFile) => writeConfigFile(data, path),
    path,
  ];
}

export function writeConfigFile(data: ConfigFile, path: string) {
  writeFile(path, JSON.stringify(data, null, 2));
}
