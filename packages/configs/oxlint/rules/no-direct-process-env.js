import { getRuleFilename } from './rule-path-helpers.js';

const allowedProcessEnvFilenamePatterns = [
  /\/packages\/clis\/utils\/src\/utils-command\/create-utils-env-validate-command\.ts$/u,
  /\/packages\/utils\/env\/src\/env\/parse-env\.ts$/u,
];

const checkIsAllowedProcessEnvFilename = (filename) =>
  allowedProcessEnvFilenamePatterns.some((pattern) => pattern.test(filename));

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

  const isProcessIdentifier =
    node.object.type === `Identifier` && node.object.name === `process`;

  if (!isProcessIdentifier) {
    return false;
  }

  const propertyName = getMemberExpressionStaticPropertyName(node);
  const isProcessEnvMemberExpression = propertyName === `env`;

  return isProcessEnvMemberExpression;
};

const checkIsInsideProcessEnvCast = (node) => {
  let currentNode = node.parent;

  while (currentNode !== undefined) {
    if (
      currentNode.type === `TSAsExpression` ||
      currentNode.type === `TSTypeAssertion` ||
      currentNode.type === `TSNonNullExpression`
    ) {
      return true;
    }

    if (
      currentNode.type !== `MemberExpression` &&
      currentNode.type !== `ChainExpression`
    ) {
      return false;
    }

    currentNode = currentNode.parent;
  }

  return false;
};

export const noDirectProcessEnvRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Disallow direct process.env access outside the validated environment loader.`,
    },
    schema: [],
    messages: {
      noDirectProcessEnv: `Use createEnv() to read typed validated environment values instead of direct process.env access.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);
    const allowProcessEnvAccess = checkIsAllowedProcessEnvFilename(filename);

    return {
      MemberExpression(node) {
        if (allowProcessEnvAccess) {
          return;
        }

        const isProcessEnvMemberExpression =
          checkIsProcessEnvMemberExpression(node);

        if (!isProcessEnvMemberExpression) {
          return;
        }

        const isInsideProcessEnvCast = checkIsInsideProcessEnvCast(node);

        if (isInsideProcessEnvCast) {
          return;
        }

        context.report({
          node,
          messageId: `noDirectProcessEnv`,
        });
      },
    };
  },
};
