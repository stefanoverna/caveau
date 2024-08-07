#!/usr/bin/env node

import { run } from 'cmd-ts';
import app from '../dist/app.mjs';

run(app, process.argv.slice(2)).catch((e) => {
  console.error();
  console.error('ERROR:', e instanceof Error ? e.message : e);
  process.exit(1);
});
