import { getRuleFilename, checkIsIndexFilename } from './rule-path-helpers.js';

const checkIsPublicReexport = (node) =>
  node.type === `ExportAllDeclaration` ||
  (node.type === `ExportNamedDeclaration` &&
    node.source !== null &&
    node.declaration === null);

export const requireIndexReexportsRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Require index files to contain public re-exports only.`,
    },
    schema: [],
    messages: {
      requireIndexReexport: `Index files must contain public re-exports only.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);
    const isIndexFilename = checkIsIndexFilename(filename);

    if (!isIndexFilename) {
      return {};
    }

    return {
      Program(node) {
        for (const statement of node.body) {
          const isPublicReexport = checkIsPublicReexport(statement);

          if (isPublicReexport) {
            continue;
          }

          context.report({
            node: statement,
            messageId: `requireIndexReexport`,
          });
        }
      },
    };
  },
};
