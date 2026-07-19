export const preferConstantsOverEnumsRule = {
  meta: {
    type: `suggestion`,
    docs: {
      description: `Use constants and derived unions instead of enums.`,
    },
    schema: [],
    messages: {
      preferConstantsOverEnums: `Use constants and derived unions instead of enums.`,
    },
  },
  create(context) {
    return {
      TSEnumDeclaration(node) {
        context.report({
          node,
          messageId: `preferConstantsOverEnums`,
        });
      },
    };
  },
};
