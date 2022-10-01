const { promisify } = require('util');
const babel = require('@babel/core');
const Acorn = require('acorn');
const { generate } = require('escodegen');
const MarkdownIt = require('markdown-it');

const transform = promisify(babel.transform);

const escape2Html = str => {
  var arrEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&', quot: '"' };
  return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, (all, t) => {
    return arrEntities[t];
  });
};

const clearCode = node => {
  if (node.directive === 'use strict') {
    return false;
  }
  if (node.type === 'ExpressionStatement' && node.expression.type === 'AssignmentExpression' && node.expression.left.object?.name === 'exports' && node.expression.left.property.name === 'default') {
    return false;
  }
  if (node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression' && node.expression.callee.object?.name === 'Object' && node.expression.callee.property.name === 'defineProperty') {
    return false;
  }
  return true;
};

const analyze = async (markdownArr, sources) => {
  let coms = '';
  for (let [index, source] of Object.entries(sources)) {
    const { code } = await transform(source, { filename: 'test.mdx' });

    const ast = Acorn.parse(code, {
      sourceType: 'module',
    });
    const endIndex = ast.body.findIndex(node => node.type === 'ExpressionStatement' && node.expression.type === 'AssignmentExpression' && node.expression.left.name === '_c');
    const replaceName = ast.body[endIndex].expression.right.name;
    ast.body = ast.body.filter((node, index) => {
      return clearCode(node) && index < endIndex;
    });
    const comCode = generate(ast).replace(/\S+\sTest\s?=/, 'return');
    console.log(code);
    console.log(comCode);
    coms += `const com${index}=(()=>{${comCode}})();\r\n`;
  }
  return coms;
};

function mdxLoader(raw) {
  transform(raw, { filename: this.resourcePath }).then(({ code }) => console.log(code));
  // const filename = this.resourcePath;
  //   const callback = this.async();
  //   const md = new MarkdownIt({ html: false });
  //   let result = md.render(raw);
  //   result = result.trim('\n');

  //   const codeReg = /<pre[^>]*>(.|[\r\n])*?<\/pre>/g;
  //   // result.split(codeReg) 有问题
  //   let sources = result.match(codeReg);

  //   const mdStr = result.replace(/<pre[^>]*>(.|[\r\n])*?<\/pre>/g, $0 => {
  //     return '$empty$';
  //   });
  //   const mds = mdStr.split('$empty$').filter(i => i);
  //   sources = sources.map(code => escape2Html(code.replace(/<pre>|<\/pre>|<code[^>]*>|<\/code>/g, '')));

  //   analyze(mds, sources).then(coms => {
  //     // const code = `
  //     //
  //     //   const App={
  //     //       components:[com0,com1]
  //     //     }
  //     //     _c = App;
  //     //     var _default = App;
  //     //     exports.default = _default;

  //     //     var _c;

  //     //     $RefreshReg$(_c, "App");
  //     // `;
  //     const code = `
  // ${coms}
  //       import React from 'react';
  //         const tmp={
  //               components:[com0,com1]
  //             }
  //       const App=()=>{
  //         console.log(tmp);
  //         return <div>11111</div>
  //       }

  //       export default App;
  //     `;
  //     callback(null, code);
  //   });

  // transform(source, { filename }).then(({ code }) => {

  //   callback(null, code);
  // });
  // const md = new MarkdownIt({ html: true }).use(MarkdownItContainer, 'demo', {
  //   render(token, index) {
  //     if (token[index].nesting === 1) {
  //       return `<CodeExample>`;
  //     } else {
  //       return '</CodeExample>\n';
  //     }
  //   },
  // });
  // const result = md.render(source);
  // let exampleIndex = -1;
  // const md = new MarkdownIt({}).use(MarkdownItContainer, 'example', {
  //   render: function (tokens, idx) {
  //     // var m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);
  //     // console.log(tokens, idx);
  //     // console.log(m[1]);

  //     if (tokens[idx].nesting === 1) {
  //       tokens[idx + 1].content = '';
  //       // console.log(tokens[idx]);
  //       // opening tag
  //       return `<example>`;
  //     } else {
  //       // closing tag
  //       return '</example>';
  //     }
  //   },
  // });

  // const result = md.render(source);
  // console.log(result);
  //

  //   return `
  //    const components1=(()=>{
  //     "use strict";

  // var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

  // Object.defineProperty(exports, "__esModule", {
  //   value: true
  // });
  // exports.default = void 0;

  // var _react = _interopRequireDefault(require("react"));

  // var _jsxRuntime = require("react/jsx-runtime");

  // return () => {
  //   const a = '111';
  //   return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
  //     children: ["hello markdown components", a]
  //   });
  // };

  //    })()

  //    const components2=(()=>{
  //     "use strict";

  //     var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

  //     Object.defineProperty(exports, "__esModule", {
  //       value: true
  //     });
  //     exports.default = void 0;

  //     var _react = _interopRequireDefault(require("react"));

  //     var _jsxRuntime = require("react/jsx-runtime");

  //     return () => {
  //       const a = '111';
  //       return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
  //         children: ["hello markdown components", a]
  //       });
  //     };

  //    })()

  //   const App={
  //     components:[components1,components2]
  //   }
  //   _c = App;
  //   var _default = App;
  //   exports.default = _default;

  //   var _c;

  //   $RefreshReg$(_c, "App");
  //     `;
  return undefined;
}

module.exports = mdxLoader;
