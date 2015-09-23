#!/usr/bin/env node

var cli = require('commander');

cli
  .version('0.0.1')
  .usage('<file ...>')
  .parse(process.argv);

console.log('running');
