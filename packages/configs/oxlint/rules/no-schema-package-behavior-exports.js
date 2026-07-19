import {
  checkIsDeclarationFilename,
  checkIsIndexFilename,
  checkIsTestFilename,
  getPackageSrcPath,
  getRuleFilename,
} from './rule-path-helpers.js';
import { workflowBehaviorVerbNamePattern } from './workflow-behavior-verbs.js';

const behaviorExportNamePattern = workflowBehaviorVerbNamePattern;

const checkIsSchemaPackageImplementationFile = (filename) => {
  const packageSrcPath = getPackageSrcPath(filename);

  if (packageSrcPath?.family !== `schemas`) {
    return false;
  }

  if (
    checkIsDeclarationFilename(filename) ||
    checkIsIndexFilename(filename) ||
    checkIsTestFilename(filename)
  ) {
    return false;
  }

  return true;
};

const getExportedIdentifierName = (node) => {
  if (node.declaration?.type !== `VariableDeclaration`) {
    return null;
  }

  const [declarator = null] = node.declaration.declarations;

  if (declarator?.id.type !== `Identifier`) {
    return null;
  }

  const result = declarator.id.name;
  return result;
};

export const noSchemaPackageBehaviorExportsRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Prevent schema packages from exporting behavior-heavy runtime operations.`,
    },
    schema: [],
    messages: {
      noSchemaPackageBehaviorExport: `Move behavior-heavy schema-shaped operations such as {{ exportName }} out of packages/schemas and into a service or utility package.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);
    const isSchemaPackageImplementationFile =
      checkIsSchemaPackageImplementationFile(filename);

    if (!isSchemaPackageImplementationFile) {
      return {};
    }

    return {
      ExportNamedDeclaration(node) {
        const exportName = getExportedIdentifierName(node);

        if (exportName === null) {
          return;
        }

        if (!behaviorExportNamePattern.test(exportName)) {
          return;
        }

        context.report({
          node,
          messageId: `noSchemaPackageBehaviorExport`,
          data: {
            exportName,
          },
        });
      },
    };
  },
};
