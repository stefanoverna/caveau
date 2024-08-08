import { subcommands } from 'cmd-ts';

import init from './commands/init';

import keysGenerate from './commands/keys/generate';

import filesAdd from './commands/files/add';
import filesDecrypt from './commands/files/decrypt';
import filesEdit from './commands/files/edit';
import filesReencrypt from './commands/files/reencrypt';
import filesRemove from './commands/files/remove';

import { packageVersion } from './utils/packageVersion';

export default subcommands({
  name: 'kavo',
  version: packageVersion,
  cmds: {
    init,
    'keys:generate': keysGenerate,
    'files:add': filesAdd,
    'files:decrypt': filesDecrypt,
    'files:edit': filesEdit,
    'files:reencrypt': filesReencrypt,
    'files:remove': filesRemove,
  },
});
