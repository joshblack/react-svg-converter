export default (name, svg) =>
`import React from 'react';

export default class ${name}Icon extends React.Component {
  render() {
    return (
      ${svg}
    );
  }
}`
