const createBacktickReplacement = (sourceCode, node) => {
  const raw = sourceCode.getText(node);
  const quote = raw.at(0);

  if (quote !== `'` && quote !== `"`) {
    return null;
  }

  const body = raw.slice(1, -1);
  const escapedBody = body.replaceAll(`\``, `\\\``).replaceAll(`\${`, `\\\${`);
  const replacement = `\`${escapedBody}\``;

  return replacement;
};

const createComputedKeyReplacement = (sourceCode, node) => {
  const replacement = createBacktickReplacement(sourceCode, node);

  if (replacement === null) {
    return null;
  }

  const computedReplacement = `[${replacement}]`;

  return computedReplacement;
};

const createJSXAttributeReplacement = (sourceCode, node) => {
  const replacement = createBacktickReplacement(sourceCode, node);

  if (replacement === null) {
    return null;
  }

  const jsxReplacement = `{${replacement}}`;

  return jsxReplacement;
};

export const preferBacktickStringLiteralsRule = {
  meta: {
    type: `layout`,
    docs: {
      description: `Prefer backticks for normal string literals.`,
    },
    fixable: `code`,
    schema: [],
    messages: {
      preferBacktickObjectKey: `Use computed backtick keys for string-literal object keys.`,
      preferBacktickStringLiteral: `Use backticks for string literals.`,
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;

    const isDirectiveLiteral = (node) => {
      const parent = node.parent;
      const result =
        parent?.type === `ExpressionStatement` &&
        parent.expression === node &&
        typeof parent.directive === `string`;

      return result;
    };

    const isStaticModuleSpecifier = (node) => {
      const parent = node.parent;
      const result =
        (parent?.type === `ImportDeclaration` && parent.source === node) ||
        (parent?.type === `ExportNamedDeclaration` && parent.source === node) ||
        (parent?.type === `ExportAllDeclaration` && parent.source === node);

      return result;
    };

    const isDeclareModuleSpecifier = (node) => {
      const parent = node.parent;
      const result =
        parent?.type === `TSModuleDeclaration` &&
        parent.id === node &&
        parent.declare === true;

      return result;
    };

    const isObjectPropertyKey = (node) => {
      const parent = node.parent;
      const result =
        parent?.type === `Property` &&
        parent.key === node &&
        parent.computed !== true;

      return result;
    };

    const isTypeMemberKey = (node) => {
      const parent = node.parent;
      const result =
        (parent?.type === `TSPropertySignature` ||
          parent?.type === `TSMethodSignature`) &&
        parent.key === node;

      return result;
    };

    const isJSXAttributeValue = (node) => {
      const parent = node.parent;
      const result = parent?.type === `JSXAttribute` && parent.value === node;

      return result;
    };

    return {
      Literal(node) {
        if (typeof node.value !== `string`) {
          return;
        }

        if (
          isDirectiveLiteral(node) ||
          isStaticModuleSpecifier(node) ||
          isDeclareModuleSpecifier(node) ||
          isTypeMemberKey(node)
        ) {
          return;
        }

        if (isObjectPropertyKey(node)) {
          const replacement = createComputedKeyReplacement(sourceCode, node);

          if (replacement === null) {
            return;
          }

          context.report({
            node,
            messageId: `preferBacktickObjectKey`,
            fix(fixer) {
              return fixer.replaceText(node, replacement);
            },
          });

          return;
        }

        if (isJSXAttributeValue(node)) {
          const replacement = createJSXAttributeReplacement(sourceCode, node);

          if (replacement === null) {
            return;
          }

          context.report({
            node,
            messageId: `preferBacktickStringLiteral`,
            fix(fixer) {
              return fixer.replaceText(node, replacement);
            },
          });

          return;
        }

        const replacement = createBacktickReplacement(sourceCode, node);

        if (replacement === null) {
          return;
        }

        context.report({
          node,
          messageId: `preferBacktickStringLiteral`,
          fix(fixer) {
            return fixer.replaceText(node, replacement);
          },
        });
      },
    };
  },
};
