const { transformFromAstSync } = require('@babel/core');
const parser = require('@babel/parser');

const insertParametersPlugin = require('./plugin');

const sourceCode = `console.log(1);`;
const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
});

const { code } = transformFromAstSync(ast, sourceCode, {
    plugins: [insertParametersPlugin]
});

console.log(code);