import { getPackageSrcPath, getRuleFilename } from './rule-path-helpers.js';
import { workflowBehaviorVerbNamePattern } from './workflow-behavior-verbs.js';

const servicePackagePattern =
  /^@jearle\/service-(?<packageName>[a-z0-9-]+)(?:\/.*)?$/u;
const serviceTestEntrypointPattern = /^@jearle\/service-[a-z0-9-]+\/test$/u;
const serviceCompositionFilePattern = /\/services\/create-services\.tsx?$/u;
const workflowImportNamePattern = workflowBehaviorVerbNamePattern;
const serviceFactoryImportNamePattern = /^create[A-Z][A-Za-z0-9]*Service$/u;

const checkIsServiceCompositionFile = (filename) =>
  serviceCompositionFilePattern.test(filename);

const checkIsOwningServicePackage = (filename, importedPackageName) => {
  const packageSrcPath = getPackageSrcPath(filename);

  if (packageSrcPath === null) {
    return false;
  }

  const result =
    packageSrcPath.family === `services` &&
    packageSrcPath.packageName === importedPackageName;

  return result;
};

const getImportedName = (specifier) => {
  if (specifier.type !== `ImportSpecifier`) {
    return null;
  }

  const { imported } = specifier;

  if (imported.type === `Identifier`) {
    return imported.name;
  }

  if (imported.type === `Literal` && typeof imported.value === `string`) {
    return imported.value;
  }

  return null;
};

const checkIsTypeOnlyImportSpecifier = (node, specifier) => {
  const result = node.importKind === `type` || specifier.importKind === `type`;

  return result;
};

export const noExternalServiceWorkflowImportsRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Prevent service package consumers from importing workflow functions instead of receiving a composed service surface.`,
    },
    schema: [],
    messages: {
      noExternalServiceWorkflowImport: `Receive service workflow behavior such as {{ importName }} through the composed service surface instead of importing it directly from {{ source }}.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);

    if (checkIsServiceCompositionFile(filename)) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        if (
          node.source.type !== `Literal` ||
          typeof node.source.value !== `string`
        ) {
          return;
        }

        const source = node.source.value;
        const servicePackageMatch = source.match(servicePackagePattern);
        const importedPackageName = servicePackageMatch?.groups?.packageName;

        if (importedPackageName === undefined) {
          return;
        }

        if (serviceTestEntrypointPattern.test(source)) {
          return;
        }

        if (checkIsOwningServicePackage(filename, importedPackageName)) {
          return;
        }

        for (const specifier of node.specifiers) {
          if (checkIsTypeOnlyImportSpecifier(node, specifier)) {
            continue;
          }

          const importName = getImportedName(specifier);

          if (importName === null) {
            continue;
          }

          if (serviceFactoryImportNamePattern.test(importName)) {
            continue;
          }

          if (workflowImportNamePattern.test(importName) === false) {
            continue;
          }

          context.report({
            node: specifier,
            messageId: `noExternalServiceWorkflowImport`,
            data: {
              importName,
              source,
            },
          });
        }
      },
    };
  },
};
