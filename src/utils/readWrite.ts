import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';

export function writeFile(path: string, content: string) {
  writeFileSync(path, content, 'utf-8');
  console.log(`Written ${path}`);
}

export function readFile(path: string) {
  return readFileSync(path, 'utf-8');
}

export function deleteFile(path: string) {
  if (existsSync(path)) {
    unlinkSync(`${path}.enc`);
    console.log(`Deleted ${path}`);
  }
}
