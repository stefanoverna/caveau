import fs from 'node:fs/promises';
import * as v from 'valibot';
import { findNearestFile } from './findNearestFile';
import { writeFile } from './readWrite';

const ConfigFileSchema = v.object({
  $schema: v.optional(v.pipe(v.string(), v.url())),
  keyring: v.pipe(v.string(), v.url()),
  recipients: v.variant('type', [
    v.object({ type: v.literal('all') }),
    v.object({ type: v.literal('subset'), ids: v.array(v.string()) }),
  ]),
  files: v.array(v.string()),
});

export type ConfigFile = v.InferOutput<typeof ConfigFileSchema>;

export const configFilename = '.caveau.json';

export function parseConfigFile(data: unknown): ConfigFile {
  const result = v.safeParse(ConfigFileSchema, data);
  if (!result.success) {
    console.log(v.flatten<typeof ConfigFileSchema>(result.issues));
    throw new Error('Invalid config file.');
  }

  return result.output;
}

export function findConfigFilePath(): Promise<string> {
  return findNearestFile(configFilename);
}

export async function configFile(): Promise<
  [ConfigFile, (data: ConfigFile) => void, string]
> {
  const path = await findConfigFilePath();
  const data = await fs.readFile(path, 'utf-8');

  return [
    parseConfigFile(JSON.parse(data)),
    (data: ConfigFile) => writeConfigFile(data, path),
    path,
  ];
}

export function writeConfigFile(data: ConfigFile, path: string) {
  writeFile(path, JSON.stringify(data, null, 2));
}
