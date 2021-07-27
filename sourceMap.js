function compile(ast) {
    switch (ast.type) {
    case 'BinaryExpression':
      return new SourceNode(
        ast.location.line,
        ast.location.column,
        ast.location.source,
        [compile(ast.left), " + ", compile(ast.right)]
      );
    case 'Literal':
      return new SourceNode(
        ast.location.line,
        ast.location.column,
        ast.location.source,
        String(ast.value)
      );
    default:
      throw new Error("Bad AST");
    }
  }
   
  var ast = parse("40 + 2", "add.js");
  console.log(compile(ast).toStringWithSourceMap({
    file: 'add.js'
  }));