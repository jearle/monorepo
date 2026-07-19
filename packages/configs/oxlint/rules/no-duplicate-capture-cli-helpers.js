import { getRuleFilename } from './rule-path-helpers.js';

const utilCliSourcePathPattern = /(?:^|\/)packages\/utils\/cli\/src\//u;

const checkIsUtilCliSource = (filename) =>
  utilCliSourcePathPattern.test(filename);

const checkIsFunctionValue = (node) =>
  node?.type === `ArrowFunctionExpression` ||
  node?.type === `FunctionExpression`;

export const noDuplicateCaptureCliHelpersRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Forbid local captureCLI helper clones outside @jearle/util-cli.`,
    },
    schema: [],
    messages: {
      noDuplicateCaptureCliHelper: `Use captureCLI from @jearle/util-cli instead of declaring a local helper clone.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);

    if (checkIsUtilCliSource(filename)) {
      return {};
    }

    return {
      FunctionDeclaration(node) {
        if (node.id?.name !== `captureCLI`) {
          return;
        }

        context.report({
          node: node.id,
          messageId: `noDuplicateCaptureCliHelper`,
        });
      },

      VariableDeclarator(node) {
        const isCaptureCliHelper =
          node.id.type === `Identifier` &&
          node.id.name === `captureCLI` &&
          checkIsFunctionValue(node.init);

        if (isCaptureCliHelper === false) {
          return;
        }

        context.report({
          node: node.id,
          messageId: `noDuplicateCaptureCliHelper`,
        });
      },
    };
  },
};
