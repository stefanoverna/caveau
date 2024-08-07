import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { extendType, string } from 'cmd-ts';

export const ExistingPath = extendType(string, {
  displayName: 'path',
  description: 'An existing path',
  async from(str) {
    const resolved = resolve(str);
    if (!existsSync(resolved)) {
      throw new Error("Path doesn't exist");
    }
    return resolved;
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
