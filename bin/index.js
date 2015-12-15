#!/usr/bin/env node

require('babel-core/register')({
  presets: ['es2015', 'stage-1']
});
require('babel-polyfill');
require('./cli');
