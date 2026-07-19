import { getRuleFilename } from './rule-path-helpers.js';
import {
  checkIsBoundaryValidationFilename,
  getRootIdentifierName,
  getStaticPropertyName,
} from './validation-boundary-helpers.js';

const validationResultNamePattern = /(?:parse|parsed|validation).*result/iu;
const validationErrorNamePattern = /(?:zod|parse|parsed|validation).*error/iu;

const checkIsZodErrorConstructor = (node) => {
  if (node.type === `Identifier`) {
    return node.name === `ZodError`;
  }

  if (node.type !== `MemberExpression`) {
    return false;
  }

  const rootIdentifierName = getRootIdentifierName(node);
  const isZodErrorConstructor =
    rootIdentifierName === `z` && getStaticPropertyName(node) === `ZodError`;

  return isZodErrorConstructor;
};

const checkIsValidationErrorExpression = (node) => {
  if (node === undefined || node === null) {
    return false;
  }

  if (node.type === `Identifier`) {
    return validationErrorNamePattern.test(node.name);
  }

  if (node.type === `ChainExpression`) {
    return checkIsValidationErrorExpression(node.expression);
  }

  if (node.type === `MemberExpression`) {
    const propertyName = getStaticPropertyName(node);
    const rootIdentifierName = getRootIdentifierName(node.object);

    if (
      propertyName === `error` &&
      rootIdentifierName !== null &&
      validationResultNamePattern.test(rootIdentifierName)
    ) {
      return true;
    }

    return checkIsValidationErrorExpression(node.object);
  }

  if (node.type === `NewExpression`) {
    const isZodErrorConstructor = checkIsZodErrorConstructor(node.callee);

    if (isZodErrorConstructor) {
      return true;
    }

    return node.arguments.some((argument) =>
      checkIsValidationErrorExpression(argument),
    );
  }

  if (node.type === `CallExpression`) {
    return node.arguments.some((argument) =>
      checkIsValidationErrorExpression(argument),
    );
  }

  if (node.type === `ObjectExpression`) {
    return node.properties.some((property) => {
      if (property.type === `SpreadElement`) {
        return checkIsValidationErrorExpression(property.argument);
      }

      return checkIsValidationErrorExpression(property.value);
    });
  }

  return false;
};

export const noThrownBoundaryValidationErrorsRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Disallow throwing Zod validation errors at validation boundaries.`,
    },
    schema: [],
    messages: {
      noThrownBoundaryValidationError: `Return a structured validation result instead of throwing Zod validation errors from boundary parsing paths.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);
    const isBoundaryValidationFilename =
      checkIsBoundaryValidationFilename(filename);

    if (!isBoundaryValidationFilename) {
      return {};
    }

    return {
      ThrowStatement(node) {
        const isValidationErrorExpression = checkIsValidationErrorExpression(
          node.argument,
        );

        if (!isValidationErrorExpression) {
          return;
        }

        context.report({
          node,
          messageId: `noThrownBoundaryValidationError`,
        });
      },
    };
  },
};
