import { command } from 'cmd-ts';
import { reEncryptAllFiles } from '../../utils/encryption';
import { privateKey } from '../../utils/prompt';

export default command({
  name: 'files:reencrypt',
  description: 'Re-encrypt all secret files (useful when recipients change)',
  args: {
    privateKey,
  },
  handler: async ({ privateKey }) => {
    await reEncryptAllFiles(privateKey);
  },
});
