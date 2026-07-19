export const noDefaultExportsRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Disallow default exports in TypeScript source files.`,
    },
    fixable: `code`,
    schema: [],
    messages: {
      noDefaultExport: `Do not use default exports; export a named value instead.`,
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();

    return {
      ExportDefaultDeclaration(node) {
        context.report({
          node,
          messageId: `noDefaultExport`,
          fix(fixer) {
            if (node.declaration.type === `Identifier`) {
              return fixer.replaceText(
                node,
                `export { ${node.declaration.name} };`,
              );
            }

            if (
              (node.declaration.type === `FunctionDeclaration` ||
                node.declaration.type === `ClassDeclaration`) &&
              node.declaration.id !== null
            ) {
              const defaultToken = sourceCode.getFirstToken(node, {
                filter: (token) => token.value === `default`,
              });

              if (defaultToken === null) {
                return null;
              }

              return fixer.removeRange([
                defaultToken.range[0],
                defaultToken.range[1] + 1,
              ]);
            }

            return null;
          },
        });
      },
    };
  },
};
