import path from 'path';
import SVGO from 'svgo';
import Promise from 'bluebird';
import invariant from 'invariant';
import svg2js from 'svgo/lib/svgo/svg2js';
import js2svg from './js2svg';

import reactTemplate from '../templates/react.es6.js';

const svgo = new SVGO();
const fs = Promise.promisifyAll(require('fs'));
const glob = Promise.promisify(require('glob'));




function transform({ name, content }) {
  const camelCaps = (str) =>
   str.split('-')
    .map((s) => s.substring(0, 1).toUpperCase() + s.substring(1, s.length))
    .join('');

  const componentName = camelCaps(name.split('.')[0]);
  console.log(componentName);

  return 'hi';
}

// optimize flag

export default async (input, output) => {
  const camelCaps = (str) =>
   str.split('-')
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
        svgo.optimize(
          content,
          (result) => resolve({ name, content: result.data })
        );
    })));

    const js = await Promise.all(
      svg.map(({ name, content }) => new Promise((resolve, reject) => {
        svg2js(content, (result) => resolve({ name, content: addStyleJSXAttribute(result) }));
      })));

    const jsxSVG = js.map(
      ({ name, content }) => ({ name, content: js2svg(content).data }));

    const programs = jsxSVG.map(
      ({ name, content }) => ({
        name,
        content: reactTemplate(name.split('.')[0], content)
    }));

    for (const { name, content } of programs) {
      const fileName = name.split('.')[0] + '.js';

      await fs.writeFileAsync(path.resolve(output, fileName), content);
    }
  } catch (e) {
    console.error(e);
  }
}

function addStyleJSXAttribute(svg) {
  const styledSVG = { ...svg };

  styledSVG.content[0].attrs = { ...svg.content[0].attrs, style: {
      name: 'style',
      value: `{this.props.style}`,
      prefix: '',
      local: '',
      type: 'JSX'
  }};

  delete styledSVG.content[0].content[1].attrs.fill

  return styledSVG;
}
