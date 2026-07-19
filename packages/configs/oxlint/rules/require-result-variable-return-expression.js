import {
  checkIsDirectPassthroughExpression,
  unwrapResultReturnExpression,
} from './require-result-variable-return-helpers.js';

export const getNonTrivialReturnExpression = (node) => {
  const { expression, hasTypeScriptWrapper } =
    unwrapResultReturnExpression(node);

  if (expression === null) {
    return null;
  }

  if (hasTypeScriptWrapper) {
    return node;
  }

  if (expression.type === `Literal`) {
    const result = expression.regex === undefined ? null : expression;

    return result;
  }

  if (expression.type === `MemberExpression`) {
    const objectExpression = getNonTrivialReturnExpression(expression.object);

    if (objectExpression !== null) {
      return objectExpression;
    }

    if (expression.computed) {
      const propertyExpression = getNonTrivialReturnExpression(
        expression.property,
      );

      if (propertyExpression !== null) {
        return propertyExpression;
      }
    }

    return null;
  }

  if (checkIsDirectPassthroughExpression(expression)) {
    return null;
  }

  if (
    expression.type === `TemplateLiteral` &&
    expression.expressions.length === 0
  ) {
    return null;
  }

  return expression;
};
