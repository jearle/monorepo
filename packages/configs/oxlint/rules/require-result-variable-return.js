import {
  getDirectIifeCall,
  getDirectResultHelperCall,
  getStructuredObjectInfo,
} from './require-result-variable-return-helpers.js';
import { getNonTrivialReturnExpression } from './require-result-variable-return-expression.js';

export const requireResultVariableReturnRule = {
  meta: {
    type: `suggestion`,
    docs: {
      description: `Require configured non-trivial return expressions to be named before returning.`,
    },
    schema: [
      {
        type: `object`,
        properties: {
          requireAllNonTrivialReturns: {
            type: `boolean`,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      requireNonTrivialVariableReturn: `Assign this non-trivial return expression to result or a domain variable before returning it, or add a justified rule-disable comment for a documented exception.`,
      requireResultHelperVariableReturn: `Assign this Result helper call to result or a domain variable before returning it.`,
      requireResultVariableReturn: `Assign this structured return object to result or a domain variable before returning it, or add a justified rule-disable comment for a documented exception.`,
      requireResultVariableReturnCast: `Move this structured return cast onto a named result or domain variable before returning it, or add a justified rule-disable comment for a documented exception.`,
      requireResultVariableReturnIife: `Replace this returned IIFE with a named function or named intermediate value, or add a justified rule-disable comment for a documented exception.`,
    },
  },
  create(context) {
    const requireAllNonTrivialReturns =
      context.options[0]?.requireAllNonTrivialReturns === true;

    return {
      ArrowFunctionExpression(node) {
        if (
          requireAllNonTrivialReturns === false ||
          node.body.type === `BlockStatement`
        ) {
          return;
        }

        const nonTrivialExpression = getNonTrivialReturnExpression(node.body);

        if (nonTrivialExpression === null) {
          return;
        }

        context.report({
          node: nonTrivialExpression,
          messageId: `requireNonTrivialVariableReturn`,
        });
      },
      ReturnStatement(node) {
        if (node.argument === null) {
          return;
        }

        const resultHelperCall = getDirectResultHelperCall(node.argument);

        if (resultHelperCall !== null) {
          context.report({
            node: resultHelperCall,
            messageId: `requireResultHelperVariableReturn`,
          });

          return;
        }

        const iifeCall = getDirectIifeCall(node.argument);

        if (iifeCall !== null) {
          context.report({
            node: iifeCall,
            messageId: `requireResultVariableReturnIife`,
          });
          return;
        }

        if (requireAllNonTrivialReturns) {
          const nonTrivialExpression = getNonTrivialReturnExpression(
            node.argument,
          );

          if (nonTrivialExpression !== null) {
            context.report({
              node: nonTrivialExpression,
              messageId: `requireNonTrivialVariableReturn`,
            });

            return;
          }
        }

        const objectInfo = getStructuredObjectInfo(node.argument);

        if (objectInfo === null || objectInfo.propertyCount < 2) {
          return;
        }

        if (objectInfo.hasTypeScriptWrapper) {
          context.report({
            node: node.argument,
            messageId: `requireResultVariableReturnCast`,
          });
          return;
        }

        if (objectInfo.computedPropertyCount < 2) {
          return;
        }

        context.report({
          node: objectInfo.node,
          messageId: `requireResultVariableReturn`,
        });
      },
    };
  },
};
