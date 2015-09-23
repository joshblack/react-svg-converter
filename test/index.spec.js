import expect from 'expect';
import svgConvert from '../src';

describe('#svgConvert', () => {
  it('should convert a glob', async () => {
    await svgConvert(
      __dirname + '/fixtures/**/*.svg',
      __dirname + '/output'
    );
  });
});
