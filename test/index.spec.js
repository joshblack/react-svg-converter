import 'babel-polyfill';

import spy from 'spy';
import path from 'path';
import expect from 'expect';
import svgConvert from '../src';
import * as templates from '../src/templates';

// Stub out fs manually, will break test:watch
let fs = require('fs');
let mocks = [];
fs.writeFileAsync = (...args) => mocks.push(args);

describe('#svgConvert', () => {
  it('should convert a glob', async () => {
    await svgConvert(
      __dirname + '/fixtures/**/*.svg',
      __dirname + '/output',
      templates['reactDefault'],
      true
    );

    const [outputPath, program] = mocks[0];

    expect(outputPath).toBe(path.resolve(__dirname, 'output', 'AddNew.js'));
    expect(program).toBe('import React from \'react\';\n\nexport default class AddNewIcon extends React.Component {\n  render() {\n    return (\n      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" {...this.props}><path d="M17 9h-2v6H9v2h6v6h2v-6h6v-2h-6"/><path className="some-class" d="M16 2C8.27 2 2 8.27 2 16s6.27 14 14 14 14-6.27 14-14S23.73 2 16 2zm0 26C9.383 28 4 22.617 4 16S9.383 4 16 4s12 5.383 12 12-5.383 12-12 12z"/></svg>\n    );\n  }\n}');
  });
});
