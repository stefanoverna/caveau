import { resolve } from 'node:path';
import age from 'age-encryption';
import { configFile } from './configFile';
import { recipientPublicKeys } from './keyringFile';
import { askPrivateKey } from './prompt';
import { readFile, writeFile } from './readWrite';

const header = '-----BEGIN AGE ENCRYPTED FILE-----';
const footer = '-----END AGE ENCRYPTED FILE-----';

export async function encryptMessage(message: string): Promise<string> {
  const { Encrypter } = await age();
  const encrypter = new Encrypter();

  for (const publicKey of await recipientPublicKeys()) {
    encrypter.addRecipient(publicKey);
  }

  const base64 = Buffer.from(encrypter.encrypt(message)).toString('base64');
  const rows = (base64.match(new RegExp(/.{1,64}/, 'g')) || []).join('\n');

  // if the last line is exactly 64 columns, add an extra newline
  let paddedFooter = footer;
  if (rows.length > 0 && rows[rows.length - 1].length === 64) {
    paddedFooter = `\n${footer}`;
  }
  return `${header}\n${rows}\n${paddedFooter}\n`;
}

export async function encryptFile(path: string): Promise<string> {
  const content = readFile(path);
  return await encryptMessage(content);
}

export async function encryptFileAndWrite(path: string): Promise<void> {
  writeFile(`${path}.enc`, await encryptFile(path));
}

export async function decryptFile(path: string, privateKey = askPrivateKey()) {
  const { Decrypter } = await age();

  const decrypter = new Decrypter();
  decrypter.addIdentity(privateKey);

  const content = readFile(`${path}.enc`);

  const withoutArmor = Buffer.from(
    content.trim().replace(header, '').replace(footer, ''),
    'base64',
  );
  return decrypter.decrypt(withoutArmor, 'text');
}

export async function decryptFileAndWrite(
  path: string,
  privateKey = askPrivateKey(),
) {
  writeFile(path, await decryptFile(path, privateKey));
}

export async function processAndMaybeReEncryptFile(
  path: string,
  privateKey = askPrivateKey(),
  processContent = async (content: string) => content,
): Promise<boolean> {
  const content = await decryptFile(path, privateKey);
  const processedContent = await processContent(content);

  if (content === processedContent) {
    console.log('Secret file not changed.');
    return false;
  }

  writeFile(`${path}.enc`, await encryptMessage(processedContent));

  return true;
}

export async function reEncryptFile(
  path: string,
  privateKey = askPrivateKey(),
): Promise<void> {
  const content = await decryptFile(path, privateKey);
  writeFile(`${path}.enc`, await encryptMessage(content));
}

export async function reEncryptAllFiles(
  privateKey = askPrivateKey(),
): Promise<void> {
  const [config, _, configFilePath] = await configFile();

  for (const file of config.files.map((path) =>
    resolve(configFilePath, path),
  )) {
    await reEncryptFile(file, privateKey);
  }
}
