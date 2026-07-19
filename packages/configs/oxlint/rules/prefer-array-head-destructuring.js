const checkIsNullLiteral = (node) =>
  node.type === `Literal` && node.value === null;

const checkIsZeroIndexProperty = (node) =>
  node.type === `Literal` && node.value === 0;

const unwrapChainExpression = (node) => {
  if (node.type === `ChainExpression`) {
    return node.expression;
  }

  return node;
};

const checkContainsOptionalChain = (node) => {
  if (node.type === `ChainExpression`) {
    return true;
  }

  if (node.type === `MemberExpression`) {
    return node.optional === true || checkContainsOptionalChain(node.object);
  }

  if (node.type === `CallExpression`) {
    return node.optional === true || checkContainsOptionalChain(node.callee);
  }

  return false;
};

const getFirstItemMemberExpression = (node) => {
  const expression = unwrapChainExpression(node);

  if (expression.type !== `MemberExpression`) {
    return null;
  }

  if (expression.computed !== true) {
    return null;
  }

  const isZeroIndexProperty = checkIsZeroIndexProperty(expression.property);

  if (isZeroIndexProperty === false) {
    return null;
  }

  return expression;
};

const createArraySourceReplacement = ({ memberExpression, sourceCode }) => {
  const sourceText = sourceCode.getText(memberExpression.object);
  const containsOptionalChain = checkContainsOptionalChain(memberExpression);

  if (containsOptionalChain === false) {
    return sourceText;
  }

  const result = `${sourceText} ?? []`;

  return result;
};

export const preferArrayHeadDestructuringRule = {
  meta: {
    type: `layout`,
    docs: {
      description: `Prefer array destructuring for first-item null fallback reads.`,
    },
    fixable: `code`,
    schema: [],
    messages: {
      preferArrayHeadDestructuring: `Use array destructuring with a null default for first-item fallback reads.`,
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;

    return {
      VariableDeclarator(node) {
        if (node.id.type !== `Identifier`) {
          return;
        }

        if (node.id.typeAnnotation != null) {
          return;
        }

        if (
          node.init?.type !== `LogicalExpression` &&
          node.init?.type !== `BinaryExpression`
        ) {
          return;
        }

        if (node.init.operator !== `??`) {
          return;
        }

        const hasNullFallback = checkIsNullLiteral(node.init.right);

        if (hasNullFallback === false) {
          return;
        }

        const memberExpression = getFirstItemMemberExpression(node.init.left);

        if (memberExpression === null) {
          return;
        }

        const arraySourceReplacement = createArraySourceReplacement({
          memberExpression,
          sourceCode,
        });

        context.report({
          node: node.init.left,
          messageId: `preferArrayHeadDestructuring`,
          fix(fixer) {
            const replacement = `[${node.id.name} = null] = ${arraySourceReplacement}`;

            return fixer.replaceText(node, replacement);
          },
        });
      },
    };
  },
};
