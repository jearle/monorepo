const checkIsNamedObjectTypeAlias = (node) => {
  const parent = node.parent;
  const result =
    parent?.type === `TSTypeAliasDeclaration` &&
    parent.typeAnnotation === node &&
    parent.id.type === `Identifier`;

  return result;
};

export const noNestedObjectTypeLiteralsRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Require named aliases for object type literals.`,
    },
    schema: [],
    messages: {
      noNestedObjectTypeLiteral: `Extract object type literals into named type aliases.`,
    },
  },
  create(context) {
    return {
      TSTypeLiteral(node) {
        const isNamedObjectTypeAlias = checkIsNamedObjectTypeAlias(node);

        if (isNamedObjectTypeAlias) {
          return;
        }

        context.report({
          node,
          messageId: `noNestedObjectTypeLiteral`,
        });
      },
    };
  },
};
