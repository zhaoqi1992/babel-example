// 希望通过 babel 能够自动在 console.log 等 api 中插入文件名和行列号的参数，
const parser = require('@babel/parser');

// 因为 @babel/parser 等包都是通过 es module 导出的，所以通过 commonjs 的方式引入有的时候要取 default 属性。
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types')
const filename = __dirname

const sourceCode1 = `console.log(1);`;
const ast = parser.parse(sourceCode1, {
  sourceType: 'unambiguous'
});

traverse(ast, {
  CallExpression(path, state) {
    if (types.isMemberExpression(path.node.callee)
      && path.node.callee.object.name === 'console'
      && ['log', 'info', 'error', 'debug'].includes(path.node.callee.property.name)
    ) {
      const { line, column } = path.node.loc.start;
      console.log(path.scope)
      console.log(path.scope.block)
      path.node.arguments.unshift(types.stringLiteral(`${filename}: (${line}, ${column})`))
    }
  }
});

const { code } = generate(ast);
console.log(code);