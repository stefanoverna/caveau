import { readFileSync, writeFileSync } from 'node:fs';

export function writeFile(path: string, content: string) {
  writeFileSync(path, content, 'utf-8');
  console.log(`Written ${path}`);
}

export function readFile(path: string) {
  return readFileSync(path, 'utf-8');
}
