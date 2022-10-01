const fs = require('fs');
const { resolve } = require('path');
const loader = require('./index');

// const path = resolve(__dirname, '../../../src/docs/test.mdx');
const path = resolve(__dirname, './wrap.jsx');
const content = fs.readFileSync(path, {
  encoding: 'utf-8',
});

const result = loader(content);
