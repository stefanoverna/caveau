import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { relative } from 'node:path';

export function writeFile(path: string, content: string) {
  writeFileSync(path, content, 'utf-8');
  const relativePath = relative(process.cwd(), path);
  console.log(`Written ${relativePath}`);
}

export function readFile(path: string) {
  return readFileSync(path, 'utf-8');
}

export function deleteFile(path: string) {
  if (existsSync(path)) {
    unlinkSync(path);
    const relativePath = relative(process.cwd(), path);
    console.log(`Deleted ${relativePath}`);
  }
}
