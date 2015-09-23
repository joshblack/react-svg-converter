import path from 'path';
import SVGO from 'svgo';
import Promise from 'bluebird';
import svg2js from 'svgo/lib/svgo/svg2js';
import js2svg from './js2svg';

const svgo = new SVGO();
const fs = Promise.promisifyAll(require('fs'));
const glob = Promise.promisify(require('glob'));

export * as templates from '../templates';

export default async (input, output, template, component) => {
  const camelCaps = (str) => str.split('-')
    .map((s) => s.substring(0, 1).toUpperCase() + s.substring(1, s.length))
    .join('');

  try {
    const matches = await glob(input);
    const files = await Promise.all(matches.map(async (match) => ({
      name: camelCaps(path.basename(match)),
      content: await fs.readFileAsync(match, 'utf-8')
    })));

    const svg = await Promise.all(files.map(
      ({ name, content }) => new Promise((resolve, reject) => {
        svgo.optimize(content,
          (result) => resolve({ name, content: result.data }));
    })));

    const jsx = await Promise.all(
      svg.map(({ name, content }) => new Promise((resolve, reject) => {
        svg2js(content, (result) => resolve({
          name,
          content: addStyleJSXAttribute(result, component)
        }));
      })));

    const jsSVG = jsx.map(
      ({ name, content }) => ({ name, content: js2svg(content).data }));

    const programs = jsSVG.map(({ name, content }) => ({
      name,
      content: template(name.split('.')[0], content)
    }));

    for (const { name, content } of programs) {
      const fileName = name.split('.')[0] + '.js';

      await fs.writeFileAsync(path.resolve(output, fileName), content);
    }
  } catch (e) {
    console.error(e);
  }
}

function addStyleJSXAttribute(svg, component) {
  const styledSVG = { ...svg };
  const propValue = component ? 'this.props' : 'props';

  styledSVG.content[0].attrs = { ...svg.content[0].attrs,
    style: {
      name: propValue,
      value: '',
      prefix: '',
      local: '',
      type: 'JSX'
    }
  };

  delete styledSVG.content[0].content[1].attrs.fill

  return styledSVG;
}
