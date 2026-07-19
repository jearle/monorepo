export const requireReadonlyTypePropertiesRule = {
  meta: {
    type: `suggestion`,
    docs: {
      description: `Require readonly object type properties.`,
    },
    fixable: `code`,
    schema: [],
    messages: {
      requireReadonlyTypeProperties: `All properties in type definitions must be readonly.`,
    },
  },
  create(context) {
    return {
      TSPropertySignature(node) {
        if (node.readonly === true) {
          return;
        }

        context.report({
          node,
          messageId: `requireReadonlyTypeProperties`,
          fix(fixer) {
            const result = fixer.insertTextBefore(node.key, `readonly `);

            return result;
          },
        });
      },
    };
  },
};
