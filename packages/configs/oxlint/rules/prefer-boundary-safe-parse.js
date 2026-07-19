import { getRuleFilename } from './rule-path-helpers.js';
import {
  checkIsBoundaryValidationFilename,
  checkIsZodSchemaMethodCall,
} from './validation-boundary-helpers.js';

export const preferBoundarySafeParseRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Require safeParse() instead of parse() at validation boundaries.`,
    },
    schema: [],
    messages: {
      preferBoundarySafeParse: `Use safeParse() at validation boundaries and return a structured result instead of throwing from Schema.parse().`,
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
      CallExpression(node) {
        const isZodParseCall = checkIsZodSchemaMethodCall(node, `parse`);

        if (!isZodParseCall) {
          return;
        }

        context.report({
          node,
          messageId: `preferBoundarySafeParse`,
        });
      },
    };
  },
};
