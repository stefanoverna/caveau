# kavo CLI Tool

kavo is a command-line interface (CLI) tool designed for managing and encrypting secret files. This tool helps with generating key pairs, encrypting/decrypting files, and securely managing configurations.

## Usage

You can use the `kavo` command followed by one of the available subcommands:

```sh
npx kavo <command> [options]
```

## Commands

### `init`

Initializes a configuration file (`.kavo.json`) in the current directory.

```sh
npx kavo init
```

### `keys:generate`

Generates a new pair of private and public keys.

```sh
npx kavo keys:generate [options]
```

**Options:**
- `-s`, `--save-private-key`: Save the private key in the user's home directory (`~/.kavo-secretkey`).

### `files:add`

Adds a new file to the list of secret files to manage and encrypts it.

```sh
npx kavo files:add ...<paths>
```

**Arguments:**
- `paths`: Paths of the secret files to encode and add to the config file.

### `files:decrypt`

Decrypts all secret files or specific files provided.

```sh
npx kavo files:decrypt [options] [...<paths>]
```

**Arguments:**
- `paths`: Paths of the secret files to decrypt (optional, if not provided, all secret files will be decrypted).

**Options:**
- `-o`, `--stdout`: Should the decrypted content be written to stdout instead?

### `files:edit`

Opens the default file editor to change the contents of a secret file, then re-encrypts it.

```sh
npx kavo files:edit [options] <path>
```

**Arguments:**
- `path`: Path of the secret file to edit.

**Options:**
- `-p`, `--private-key`: Specify the private key to use.
- `-d`, `--decrypt`: Should the decrypted version of the file also be updated after the edit?

### `files:reencrypt`

Re-encrypts all secret files (useful when recipients change).

```sh
npx kavo files:reencrypt
```

### `files:remove`

Removes a file from the list of secret files to manage and deletes the encrypted version.

```sh
npx kavo files:remove ...<paths>
```

**Arguments:**
- `[paths]`: Paths of the secret file to remove.

## Configuration

kavo uses a configuration file named `.kavo.json` in the current directory. This file manages cryptographic settings and the list of encrypted files.

Here is an example configuration:

```json
{
  "$schema": "https://unpkg.com/kavo@0.2.0/schemas/config.json",
  "keyring": "https://example.com/keyring.json",
  "recipients": {
    "type": "subset",
    "teamIds": ["devs"],
    "publicKeyIds": ["sarah"]
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
- `files`: List of files managed by kavo.

## Keyring

kavo also uses a `keyring.json` file to manage public keys.

Example keyring schema:

```json
{
  "$schema": "https://unpkg.com/kavo@0.2.0/schemas/keyring.json",
  "publicKeys": {
    "mark": "age...",
    "tom": "age...",
    "sarah": "age...",
    "alice": "age..."
  },
  "teams": {
    "devs": ["mark", "tom"],
    "support": ["alice"]
  }
}
```

### Schema of Keyring Fields:

- `$schema`: Optional schema URL.
- `publicKeys`: The list of public keys, organized by ID. Only keys starting with "age" are valid.
