const typeScriptExpressionWrapperTypes = new Set([
  `TSAsExpression`,
  `TSInstantiationExpression`,
  `TSNonNullExpression`,
  `TSSatisfiesExpression`,
  `TSTypeAssertion`,
]);

const directPassthroughExpressionTypes = new Set([
  `Identifier`,
  `Literal`,
  `MemberExpression`,
  `MetaProperty`,
  `Super`,
  `ThisExpression`,
]);

const computedExpressionTypes = new Set([
  `ArrayExpression`,
  `AssignmentExpression`,
  `AwaitExpression`,
  `BinaryExpression`,
  `CallExpression`,
  `ConditionalExpression`,
  `LogicalExpression`,
  `NewExpression`,
  `ObjectExpression`,
  `SequenceExpression`,
  `TaggedTemplateExpression`,
  `UnaryExpression`,
  `UpdateExpression`,
  `YieldExpression`,
]);

const resultHelperNames = new Set([
  `createResultError`,
  `createResultSuccess`,
  `wrapResultError`,
]);

export const unwrapResultReturnExpression = (node) => {
  let expression = node;
  let hasTypeScriptWrapper = false;

  while (expression !== null && expression !== undefined) {
    if (expression.type === `ParenthesizedExpression`) {
      expression = expression.expression;
      continue;
    }

    if (expression.type === `ChainExpression`) {
      expression = expression.expression;
      continue;
    }

    if (typeScriptExpressionWrapperTypes.has(expression.type)) {
      hasTypeScriptWrapper = true;
      expression = expression.expression;
      continue;
    }

    return {
      expression,
      hasTypeScriptWrapper,
    };
  }

  return {
    expression: null,
    hasTypeScriptWrapper,
  };
};

const checkIsComputedKey = (property) => {
  if (property.computed !== true) {
    return false;
  }

  const { expression } = unwrapResultReturnExpression(property.key);
  return (
    expression === null ||
    !directPassthroughExpressionTypes.has(expression.type)
  );
};

export const checkIsDirectPassthroughExpression = (node) => {
  const result = directPassthroughExpressionTypes.has(node.type);

  return result;
};

export const getDirectResultHelperCall = (node) => {
  const { expression } = unwrapResultReturnExpression(node);
  const result =
    expression?.type === `CallExpression` &&
    expression.callee.type === `Identifier` &&
    resultHelperNames.has(expression.callee.name)
      ? expression
      : null;

  return result;
};

const checkIsComputedPropertyValue = (property) => {
  if (property.type === `SpreadElement`) {
    return true;
  }

  const { expression, hasTypeScriptWrapper } = unwrapResultReturnExpression(
    property.value,
  );

  if (hasTypeScriptWrapper) {
    return true;
  }

  if (expression === null) {
    return false;
  }

  if (expression.type === `TemplateLiteral`) {
    return expression.expressions.length > 0;
  }

  return computedExpressionTypes.has(expression.type);
};

export const getStructuredObjectInfo = (node) => {
  const { expression, hasTypeScriptWrapper } =
    unwrapResultReturnExpression(node);

  if (expression?.type !== `ObjectExpression`) {
    return null;
  }

  const propertyCount = expression.properties.length;
  const computedPropertyCount = expression.properties.filter(
    (property) =>
      checkIsComputedKey(property) || checkIsComputedPropertyValue(property),
  ).length;
  const result = {
    computedPropertyCount,
    hasTypeScriptWrapper,
    node: expression,
    propertyCount,
  };

  return result;
};

export const getDirectIifeCall = (node) => {
  const { expression } = unwrapResultReturnExpression(node);

  if (expression?.type !== `CallExpression`) {
    return null;
  }

  const { expression: callee } = unwrapResultReturnExpression(
    expression.callee,
  );
  const isInlineFunction =
    callee?.type === `ArrowFunctionExpression` ||
    callee?.type === `FunctionExpression`;

  if (isInlineFunction === false) {
    return null;
  }

  return expression;
};
