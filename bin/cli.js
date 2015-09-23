import cli from 'commander';
import Promise from 'bluebird';
import invariant from 'invariant';
import converter from '../src';
import * as templates from '../templates';

cli
  .version('0.0.1')
  .option('-i, --input <path>', 'input path to your SVG files')
  .option('-o, --output <path>', 'output path for your generated React components')
  .option('-t, --template [value]', 'template that you want to generate (default, function)')
  .parse(process.argv);

var template = cli.template || 'reactDefault';
var component = template === 'reactDefault' ? true : false;

invariant(cli.input, 'You need to specify an input path');
invariant(cli.output, 'You need to specify an output path');
invariant(templates[template], 'Specify a valid template, one of (reactDefault, reactFunction)');

Promise.resolve(converter(cli.input, cli.output, templates[template], component));
