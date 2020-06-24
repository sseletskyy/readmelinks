#!/usr/bin/env node
'use strict';
console.log('process.argv, ', process.argv);
require('../src/cli').run(process.argv.slice(2));
