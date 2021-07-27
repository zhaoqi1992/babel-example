// 改为在 console.xx 节点之前打印的方式
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const types = require("@babel/types");
const template = require("@babel/template");
const filename = __dirname;

const sourceCode1 = `console.log(1);`;
const ast = parser.parse(sourceCode1, {
  sourceType: "unambiguous",
});

traverse(ast, {
  CallExpression(path, state) {
    if (path.node.isNew) {
      return;
    }
    if (
      types.isMemberExpression(path.node.callee) &&
      path.node.callee.object.name === "console" &&
      ["log", "info", "error", "debug"].includes(path.node.callee.property.name)
    ) {
      const { line, column } = path.node.loc.start;
      const newNode = template.expression(
        `console.log("${filename}: (${line}, ${column})")`
      )();
      newNode.isNew = true;
      path.insertBefore(newNode);
    }
  },
});
const { code } = generate(ast);
console.log(code);
