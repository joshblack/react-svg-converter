# Overview

> Allows you to generate usable React components from SVG files. These React components take in any arbitrary props that you pass into them, such as `style`, `className`, `onHover`, etc.

For example,

```
// path/to/icons/add-new.svg

<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     width="32px" height="32px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve">
<g>
    <polygon points="17,9 15,9 15,15 9,15 9,17 15,17 15,23 17,23 17,17 23,17 23,15 17,15    "/>
    <path d="M16,2C8.269,2,2,8.269,2,16s6.269,14,14,14s14-6.269,14-14S23.731,2,16,2z M16,28C9.383,28,4,22.617,4,16S9.383,4,16,4
        s12,5.383,12,12S22.617,28,16,28z"/>
</g>
</svg>
```

becomes:

```
export default class AddNewIcon extends Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" {...this.props}><path d="M17 9h-2v6H9v2h6v6h2v-6h6v-2h-6"/><path d="M16 2C8.27 2 2 8.27 2 16s6.27 14 14 14 14-6.27 14-14S23.73 2 16 2zm0 26C9.383 28 4 22.617 4 16S9.383 4 16 4s12 5.383 12 12-5.383 12-12 12z"/></svg>;
    );
  }
}
```

## Usage

You can interface with this package in two ways,

1. the CLI
2. the root `index.js` in the project

You can use the CLI by specifying an input glob pattern with `-i`, an output for the files to go to with `-o`, and the template you want to use to transform the SVG files with `-t`;

Reference:

```js
cli
  .version('0.0.1')
  .option('-i, --input <path>', 'input path to your SVG files')
  .option('-o, --output <path>', 'output path for your generated React components')
  .option('-t, --template [value]', 'template that you want to generate [reactDefault, reactFunction]')
```

If you choose to use the project itself, it exposes a single function that you can require that takes in an input glob, an output directory, a template function, and a boolean corresponding to whether or not you're generating a component.

```
import path from 'path';
import convert from 'react-svg-converter';
import { reactDefault, reactFunction } from 'templates';

const input = __dirname + 'path/to/icons/**/*.svg';
const output = path.resolve(__dirname, 'path/to/output');

convert(input, output, reactDefault, true);
```

## Templates

Templates are defined in `templates` and take in a `name` parameter that corresopnds to the name of the component and a `svg` parameter that corresponds to optimized svg with added prop values.

Example:

```js
// templates/react.default.js

export default (name, svg) =>
`import { Component } from 'react';

export default class ${name}Icon extends Component {
  render() {
    return (
      ${svg};
    );
  }
}`
```
