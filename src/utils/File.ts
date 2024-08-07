import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { extendType, string } from 'cmd-ts';

export const ResolvedPath = extendType(string, {
  displayName: 'path',
  description: 'A file path',
  async from(str) {
    return resolve(str);
  },
});

export const ExistingPath = extendType(ResolvedPath, {
  displayName: 'path',
  description: 'An existing path',
  async from(str) {
    if (!existsSync(str)) {
      throw new Error("Path doesn't exist");
    }
    return str;
  },
});

export const File = extendType(ExistingPath, {
  async from(resolved) {
    const stat = statSync(resolved);
    if (stat.isFile()) {
      return resolved;
    }
    throw new Error('Provided path is not a file.');
  },
  displayName: 'file',
  description: 'A file in the file system',
});
