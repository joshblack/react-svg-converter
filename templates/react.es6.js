export default (name, svg) =>
`import { Component } from 'react';

export default class ${name}Icon extends Component {
  render() {
    return (
      ${svg}
    );
  }
}`
