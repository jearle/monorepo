const checkHasConditionalExpression = (node) => {
  if (node === null || node === undefined || typeof node !== `object`) {
    return false;
  }

  if (Array.isArray(node)) {
    const result = node.some((item) => checkHasConditionalExpression(item));

    return result;
  }

  if (node.type === `ConditionalExpression`) {
    return true;
  }

  for (const [key, value] of Object.entries(node)) {
    if (
      key === `parent` ||
      key === `loc` ||
      key === `range` ||
      key === `type`
    ) {
      continue;
    }

    if (checkHasConditionalExpression(value)) {
      return true;
    }
  }

  return false;
};

export const noNestedTernariesRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Disallow nested ternary expressions.`,
    },
    schema: [],
    messages: {
      noNestedTernary: `Nested ternary expressions are not allowed.`,
    },
  },
  create(context) {
    return {
      'ConditionalExpression'(node) {
        const hasNestedTernary =
          checkHasConditionalExpression(node.test) ||
          checkHasConditionalExpression(node.consequent) ||
          checkHasConditionalExpression(node.alternate);

        if (hasNestedTernary === false) {
          return;
        }

        context.report({
          node,
          messageId: `noNestedTernary`,
        });
      },
    };
  },
};
