module.exports = function ({ types, template }) {
  return {
    visitor: {
      CallExpression(path, state) {
        if (path.node.isNew) {
          return;
        }

        if (
          types.isMemberExpression(path.node.callee) &&
          path.node.callee.object.name === "console" &&
          ["log", "info", "error", "debug"].includes(
            path.node.callee.property.name
          )
        ) {
          const { line, column } = path.node.loc.start;
          //   const newNode = template.expression(
          //     `console.log("${filename}: (${line}, ${column})")`
          //   )();
          const newNode = template.expression(
            `console.log("${
              state.file.filename || "unkown filename"
            }: (${line}, ${column})")`
          )();
          newNode.isNew = true;
          path.insertBefore(newNode);
        }
      },
    },
  };
};
