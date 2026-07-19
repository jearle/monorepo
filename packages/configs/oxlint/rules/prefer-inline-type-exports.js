export const preferInlineTypeExportsRule = {
  meta: {
    type: `layout`,
    docs: {
      description: `Prefer inline type exports over top-level named export type declarations.`,
    },
    fixable: `code`,
    schema: [],
    messages: {
      preferInlineTypeExports: `Use inline type exports instead of top-level named export type declarations.`,
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;

    const getExportTypeToken = (node) => {
      const exportToken = sourceCode.getFirstToken(node);

      if (exportToken === null) {
        return null;
      }

      const typeToken = sourceCode.getTokenAfter(exportToken);

      if (typeToken?.value !== `type`) {
        return null;
      }

      return typeToken;
    };

    const getIsNamedTypeExportDeclaration = (node) => {
      const result =
        node.exportKind === `type` &&
        node.specifiers.length > 0 &&
        node.specifiers.every((specifier) => {
          const isExportSpecifier = specifier.type === `ExportSpecifier`;

          return isExportSpecifier;
        });

      return result;
    };

    return {
      ExportNamedDeclaration(node) {
        if (getIsNamedTypeExportDeclaration(node) === false) {
          return;
        }

        const exportToken = sourceCode.getFirstToken(node);
        const typeToken = getExportTypeToken(node);

        if (exportToken === null || typeToken === null) {
          return;
        }

        context.report({
          node,
          messageId: `preferInlineTypeExports`,
          fix(fixer) {
            const fixes = [
              fixer.removeRange([exportToken.range[1], typeToken.range[1]]),
              ...node.specifiers.map((specifier) => {
                const fix = fixer.insertTextBefore(specifier, `type `);

                return fix;
              }),
            ];

            return fixes;
          },
        });
      },
    };
  },
};
