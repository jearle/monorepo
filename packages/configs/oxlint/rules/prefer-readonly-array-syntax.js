const getTypeReferenceName = (node) => {
  if (node.type !== `TSTypeReference`) {
    return null;
  }

  const typeName = node.typeName;

  if (typeName.type !== `Identifier`) {
    return null;
  }

  return typeName.name;
};

export const preferReadonlyArraySyntaxRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Require readonly T[] syntax instead of ReadonlyArray<T>.`,
    },
    schema: [],
    messages: {
      preferReadonlyArraySyntax: `Use readonly T[] syntax instead of ReadonlyArray<T>.`,
    },
  },
  create(context) {
    return {
      TSTypeReference(node) {
        const typeReferenceName = getTypeReferenceName(node);

        if (typeReferenceName !== `ReadonlyArray`) {
          return;
        }

        context.report({
          node,
          messageId: `preferReadonlyArraySyntax`,
        });
      },
    };
  },
};
