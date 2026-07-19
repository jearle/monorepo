import { getRuleFilename } from './rule-path-helpers.js';

const allowedExitCodeAssignmentPathPattern =
  /(?:^|\/)packages\/utils\/cli\/src\//u;

const checkIsAllowedExitCodeAssignmentFile = (filename) =>
  allowedExitCodeAssignmentPathPattern.test(filename);

const checkIsProcessExitCodeReference = (node) => {
  if (node.type !== `MemberExpression`) {
    return false;
  }

  if (node.object.type !== `Identifier` || node.object.name !== `process`) {
    return false;
  }

  const property = node.property;

  if (property.type === `Identifier`) {
    return property.name === `exitCode`;
  }

  if (property.type === `Literal`) {
    return property.value === `exitCode`;
  }

  if (
    property.type === `TemplateLiteral` &&
    property.expressions.length === 0
  ) {
    const [quasi = null] = property.quasis;

    return quasi?.value.cooked === `exitCode`;
  }

  return false;
};

export const noProcessExitCodeAssignmentRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Forbid process.exitCode assignment outside @jearle/util-cli.`,
    },
    schema: [],
    messages: {
      noProcessExitCodeAssignment: `Use setCLIFailureExitCode from @jearle/util-cli instead of assigning process.exitCode directly.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);

    if (checkIsAllowedExitCodeAssignmentFile(filename)) {
      return {};
    }

    return {
      AssignmentExpression(node) {
        if (checkIsProcessExitCodeReference(node.left) === false) {
          return;
        }

        context.report({
          node: node.left,
          messageId: `noProcessExitCodeAssignment`,
        });
      },
    };
  },
};
