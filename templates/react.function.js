export default (name, svg) =>
`const ${name}Icon = (props) =>
  ${svg};

export default ${name}Icon;`;
