const getTypeReferenceName = (node) => {
  if (node?.type !== `TSTypeReference`) {
    return null;
  }

  const typeName = node.typeName;

  if (typeName.type !== `Identifier`) {
    return null;
  }

  return typeName.name;
};

const getParameterIdentifier = (node) => {
  if (node.type === `Identifier`) {
    return node;
  }

  if (node.type === `AssignmentPattern` && node.left.type === `Identifier`) {
    return node.left;
  }

  return null;
};

const getPropertyName = (node) => {
  const key = node.key;

  if (key.type === `Identifier`) {
    return key.name;
  }

  if (key.type === `Literal` && typeof key.value === `string`) {
    return key.value;
  }

  return null;
};

const checkHasOptionsSuffix = (typeAnnotation) => {
  const typeName = getTypeReferenceName(typeAnnotation);
  const result = typeName?.endsWith(`Options`) ?? false;

  return result;
};

export const requireOptionsTypeSuffixRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Require Options-suffixed types for values named options.`,
    },
    schema: [],
    messages: {
      requireOptionsTypeSuffix: `Use an Options-suffixed type for values named options.`,
    },
  },
  create(context) {
    return {
      ':function'(node) {
        for (const parameter of node.params) {
          const identifier = getParameterIdentifier(parameter);

          if (identifier?.name !== `options`) {
            continue;
          }

          const typeAnnotation = identifier.typeAnnotation?.typeAnnotation;

          if (checkHasOptionsSuffix(typeAnnotation)) {
            continue;
          }

          context.report({
            node: identifier,
            messageId: `requireOptionsTypeSuffix`,
          });
        }
      },

      'TSPropertySignature'(node) {
        const propertyName = getPropertyName(node);

        if (propertyName !== `options`) {
          return;
        }

        const typeAnnotation = node.typeAnnotation?.typeAnnotation;

        if (checkHasOptionsSuffix(typeAnnotation)) {
          return;
        }

        context.report({
          node: node.key,
          messageId: `requireOptionsTypeSuffix`,
        });
      },
    };
  },
};
