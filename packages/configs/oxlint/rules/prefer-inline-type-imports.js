export const preferInlineTypeImportsRule = {
  meta: {
    type: `layout`,
    docs: {
      description: `Prefer inline type imports over top-level named import type declarations.`,
    },
    fixable: `code`,
    schema: [],
    messages: {
      preferInlineTypeImports: `Use inline type imports instead of top-level named import type declarations.`,
      preferInlineTypeSpecifier: `Use an inline type import for this type-only named import.`,
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;

    const getImportTypeToken = (node) => {
      const importToken = sourceCode.getFirstToken(node);

      if (importToken === null) {
        return null;
      }

      const typeToken = sourceCode.getTokenAfter(importToken);

      if (typeToken?.value !== `type`) {
        return null;
      }

      return typeToken;
    };

    const getIsNamedTypeImportDeclaration = (node) => {
      const result =
        node.importKind === `type` &&
        node.specifiers.length > 0 &&
        node.specifiers.every((specifier) => {
          const isImportSpecifier = specifier.type === `ImportSpecifier`;

          return isImportSpecifier;
        });

      return result;
    };

    const getIsTypeOnlyReference = (reference) => {
      const result =
        reference.isTypeReference === true &&
        reference.isValueReference !== true;

      return result;
    };

    const getIsTypeOnlyImportSpecifier = (specifier) => {
      if (
        specifier.type !== `ImportSpecifier` ||
        specifier.importKind === `type`
      ) {
        return false;
      }

      const variables = sourceCode.getDeclaredVariables(specifier);
      const [variable = null] = variables;

      if (variable === null || variable.references.length === 0) {
        return false;
      }

      const result = variable.references.every((reference) => {
        const isTypeOnlyReference = getIsTypeOnlyReference(reference);

        return isTypeOnlyReference;
      });

      return result;
    };

    return {
      ImportDeclaration(node) {
        if (getIsNamedTypeImportDeclaration(node) === true) {
          const importToken = sourceCode.getFirstToken(node);
          const typeToken = getImportTypeToken(node);

          if (importToken === null || typeToken === null) {
            return;
          }

          context.report({
            node,
            messageId: `preferInlineTypeImports`,
            fix(fixer) {
              const fixes = [
                fixer.removeRange([importToken.range[1], typeToken.range[1]]),
                ...node.specifiers.map((specifier) => {
                  const fix = fixer.insertTextBefore(specifier, `type `);

                  return fix;
                }),
              ];

              return fixes;
            },
          });

          return;
        }

        node.specifiers.forEach((specifier) => {
          if (getIsTypeOnlyImportSpecifier(specifier) === false) {
            return;
          }

          context.report({
            node: specifier,
            messageId: `preferInlineTypeSpecifier`,
            fix(fixer) {
              const fix = fixer.insertTextBefore(specifier, `type `);

              return fix;
            },
          });
        });
      },
    };
  },
};
