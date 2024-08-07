import {
  accessSync,
  existsSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { relative } from 'node:path';

export function writeFile(path: string, content: string, mode = 0o666) {
  writeFileSync(path, content, { encoding: 'utf-8', mode: mode });
  const relativePath = relative(process.cwd(), path);
  console.log(`Written ${relativePath}`);
}

export function readFile(path: string) {
  accessSync(path);
  const statResult = statSync(path);

  if (!statResult.isFile()) {
    throw new Error(`Could not find file: ${path}`);
  }

  return readFileSync(path, { encoding: 'utf-8' });
}

export function deleteFile(path: string) {
  if (existsSync(path)) {
    unlinkSync(path);
    const relativePath = relative(process.cwd(), path);
    console.log(`Deleted ${relativePath}`);
  }
}
