const getMemberExpressionStaticPropertyName = (node) => {
  if (node.property.type === `Identifier` && node.computed === false) {
    return node.property.name;
  }

  if (
    node.property.type === `Literal` &&
    typeof node.property.value === `string`
  ) {
    return node.property.value;
  }

  return null;
};

const checkIsProcessEnvMemberExpression = (node) => {
  if (node.type !== `MemberExpression`) {
    return false;
  }

  if (node.object.type === `ChainExpression`) {
    return checkContainsProcessEnv(node.object.expression);
  }

  const isProcessEnvMemberExpression =
    node.object.type === `Identifier` &&
    node.object.name === `process` &&
    getMemberExpressionStaticPropertyName(node) === `env`;

  if (isProcessEnvMemberExpression) {
    return true;
  }

  return checkContainsProcessEnv(node.object);
};

const checkContainsProcessEnv = (node) => {
  if (node === undefined || node === null) {
    return false;
  }

  if (node.type === `ChainExpression`) {
    return checkContainsProcessEnv(node.expression);
  }

  if (node.type === `MemberExpression`) {
    return checkIsProcessEnvMemberExpression(node);
  }

  return false;
};

const checkProcessEnvCast = (context, node) => {
  const containsProcessEnv = checkContainsProcessEnv(node.expression);

  if (!containsProcessEnv) {
    return;
  }

  context.report({
    node,
    messageId: `noProcessEnvCast`,
  });
};

export const noProcessEnvCastsRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Disallow direct casts of process.env values.`,
    },
    schema: [],
    messages: {
      noProcessEnvCast: `Do not cast process.env values; read typed validated values from createEnv() instead.`,
    },
  },
  create(context) {
    return {
      TSAsExpression(node) {
        checkProcessEnvCast(context, node);
      },
      TSNonNullExpression(node) {
        checkProcessEnvCast(context, node);
      },
      TSTypeAssertion(node) {
        checkProcessEnvCast(context, node);
      },
    };
  },
};
