import { checkIsTestFilename, getRuleFilename } from './rule-path-helpers.js';

const internalMonorepoMockPattern = /^@jearle\/[^/]+\/.+/u;

const getStaticMemberPropertyName = (node) => {
  if (!node.computed && node.property.type === `Identifier`) {
    return node.property.name;
  }

  if (
    node.computed &&
    node.property.type === `Literal` &&
    typeof node.property.value === `string`
  ) {
    return node.property.value;
  }

  return null;
};

const checkIsMockCallee = (callee) => {
  if (callee.type === `Identifier`) {
    return callee.name === `mockModule`;
  }

  if (callee.type !== `MemberExpression`) {
    return false;
  }

  const propertyName = getStaticMemberPropertyName(callee);

  if (propertyName === `mock` || propertyName === `doMock`) {
    const isTestFrameworkMockCall =
      callee.object.type === `Identifier` &&
      (callee.object.name === `vi` || callee.object.name === `jest`);

    return isTestFrameworkMockCall;
  }

  const isBunMockModuleCall =
    propertyName === `module` &&
    callee.object.type === `Identifier` &&
    callee.object.name === `mock`;

  return isBunMockModuleCall;
};

const getMockSource = (node) => {
  const isMockCallee = checkIsMockCallee(node.callee);

  if (!isMockCallee) {
    return null;
  }

  const firstArgument = node.arguments[0];

  if (
    firstArgument?.type !== `Literal` ||
    typeof firstArgument.value !== `string`
  ) {
    return null;
  }

  return firstArgument.value;
};

const checkIsInternalMockSource = (source) =>
  source.startsWith(`.`) || internalMonorepoMockPattern.test(source);

export const noInternalModuleMocksRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Disallow internal local or Monorepo package module mocks in tests.`,
    },
    schema: [],
    messages: {
      noInternalModuleMock: `Use real local or package dependencies in tests instead of mocking internal modules.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);
    const isTestFilename = checkIsTestFilename(filename);

    if (!isTestFilename) {
      return {};
    }

    return {
      CallExpression(node) {
        const source = getMockSource(node);

        if (source === null) {
          return;
        }

        const isInternalMockSource = checkIsInternalMockSource(source);

        if (!isInternalMockSource) {
          return;
        }

        context.report({
          node,
          messageId: `noInternalModuleMock`,
        });
      },
    };
  },
};
