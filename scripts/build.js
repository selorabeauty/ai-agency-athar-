const { spawnSync } = require('node:child_process');

const result = spawnSync(
  process.platform === 'win32' ? 'next.cmd' : 'next',
  ['build'],
  { stdio: 'inherit' },
);

process.exit(result.status ?? 1);
