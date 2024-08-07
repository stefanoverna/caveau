import { access, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

export async function findNearestFile(
  fileName: string,
  directoryPath: string = resolve(),
): Promise<string> {
  const result = await safeFindNearestFile(fileName, directoryPath);

  if (!result) {
    throw new Error(`No "${fileName}" file found.`);
  }

  return result;
}

export async function safeFindNearestFile(
  fileName: string,
  directoryPath: string = resolve(),
): Promise<string | false> {
  try {
    const path = join(directoryPath, fileName);
    await access(path);
    const statResult = await stat(path);

    if (!statResult.isFile()) {
      throw new Error('Not a file.');
    }

    return path;
  } catch (e) {
    const parentDirectoryPath = dirname(directoryPath);

    if (parentDirectoryPath === directoryPath) {
      return false;
    }

    return findNearestFile(fileName, parentDirectoryPath);
  }
}
