import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from './readWrite';

const __filename = fileURLToPath(import.meta.url);

const packageJsonPath = resolve(
  dirname(__filename),
  '..',
  '..',
  'package.json',
);

export const packageVersion = JSON.parse(readFile(packageJsonPath))
  .version as string;
