# Caveau CLI Tool

Caveau is a command-line interface (CLI) tool designed for managing and encrypting secret files. This tool helps with generating key pairs, encrypting/decrypting files, and securely managing configurations.

## Usage

You can use the `caveau` command followed by one of the available subcommands:

```sh
npx caveau <command> [options]
```

## Commands

### `init`

Initializes a configuration file (`.caveau.json`) in the current directory.

```sh
npx caveau init
```

### `keys:generate`

Generates a new pair of private and public keys.

```sh
npx caveau keys:generate [options]
```

**Options:**
- `-s`, `--save-private-key`: Save the private key in the user's home directory (`~/.caveau-secretkey`).

### `files:add`

Adds a new file to the list of secret files to manage and encrypts it.

```sh
npx caveau files:add <path>
```

**Arguments:**
- `path`: Path of the secrets file to encode and add to the config file.

### `files:decrypt`

Decrypts all secret files or specific files provided.

```sh
npx caveau files:decrypt [...<files>]
```

**Arguments:**
- `files`: Paths of the secret files to decrypt (optional, if not provided, all secret files will be decrypted).

### `files:edit`

Opens the default file editor to change the contents of a secret file, then re-encrypts it.

```sh
npx caveau files:edit <path> [options]
```

**Arguments:**
- `path`: Path of the secret file to edit.

**Options:**
- `-p`, `--private-key`: Specify the private key to use.
- `-d`, `--decrypt`: Should the decrypted version of the file also be updated after the edit?

### `files:reencrypt`

Re-encrypts all secret files (useful when recipients change).

```sh
npx caveau files:reencrypt
```

### `files:remove`

Removes a file from the list of secret files to manage and deletes the encrypted version.

```sh
npx caveau files:remove ...<files>]
```

**Arguments:**
- `files`: Paths of the secret file to remove.

## Configuration

Caveau uses a configuration file named `.caveau.json` in the current directory. This file manages cryptographic settings and the list of encrypted files.

Here is an example configuration:

```json
{
  "$schema": "https://unpkg.com/caveau@0.2.0/schemas/config.json",
  "keyring": "https://example.com/keyring.json",
  "recipients": {
    "type": "subset",
    "ids": ["recipient1", "recipient2"]
  },
  "files": ["secrets/file1.txt", "secrets/file2.txt"]
}
```

### Schema of Configuration Fields:

- `$schema`: Optional schema URL.
- `keyring`: URL of the keyring that stores all public keys by ID.
- `recipients`:
  - `type`: Indicates which recipients in the keyring can decrypt the files (`all` or `subset`).
  - `ids`: If type is `subset`, this is the list of public key IDs.
- `files`: List of files managed by Caveau.

## Keyring

Caveau also uses a `keyring.json` file to manage public keys.

Example keyring schema:

```json
{
  "$schema": "https://unpkg.com/caveau@0.2.0/schemas/keyring.json",
  "publicKeys": {
    "recipient1": "age...",
    "recipient2": "age..."
  }
}
```

### Schema of Keyring Fields:

- `$schema`: Optional schema URL.
- `publicKeys`: The list of public keys, organized by ID. Only keys starting with "age" are valid.
