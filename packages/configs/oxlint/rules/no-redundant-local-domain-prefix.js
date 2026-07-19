import { getPackageSrcPath, getRuleFilename } from './rule-path-helpers.js';

// Case-sensitive by design so SCREAMING_SNAKE machine-readable constants are
// not flagged as redundant public domain names.
const redundantDomainNamePattern = /BehaviorDatasets?|behaviorDatasets?/u;

const behaviorDatasetPackageKeys = new Set([
  `schemas/behavior-datasets`,
  `services/behavior-datasets`,
]);

const allowedNames = new Set([
  `BehaviorDatasetsServiceError`,
  `BehaviorDatasetsService`,
  `BehaviorDatasetsServiceContext`,
  `createBehaviorDatasetsService`,
]);

const checkIsBehaviorDatasetPackageSource = (filename) => {
  const packageSrcPath = getPackageSrcPath(filename);

  if (packageSrcPath === null) {
    return false;
  }

  const packageKey = `${packageSrcPath.family}/${packageSrcPath.packageName}`;
  const result = behaviorDatasetPackageKeys.has(packageKey);

  return result;
};

const checkIsRedundantDomainName = (name) => {
  if (allowedNames.has(name)) {
    return false;
  }

  const result = redundantDomainNamePattern.test(name);

  return result;
};

const getIdentifierPatternNames = (node) => {
  if (node.type === `Identifier`) {
    return [
      {
        name: node.name,
        node,
      },
    ];
  }

  if (node.type === `ObjectPattern`) {
    return node.properties.flatMap((property) => {
      if (property.type === `RestElement`) {
        return getIdentifierPatternNames(property.argument);
      }

      return getIdentifierPatternNames(property.value);
    });
  }

  if (node.type === `ArrayPattern`) {
    return node.elements.flatMap((element) =>
      element === null ? [] : getIdentifierPatternNames(element),
    );
  }

  if (node.type === `AssignmentPattern`) {
    return getIdentifierPatternNames(node.left);
  }

  if (node.type === `RestElement`) {
    return getIdentifierPatternNames(node.argument);
  }

  return [];
};

const getDeclarationExportInfos = (declaration) => {
  if (declaration.type === `VariableDeclaration`) {
    return declaration.declarations.flatMap((declarator) =>
      getIdentifierPatternNames(declarator.id),
    );
  }

  if (
    (declaration.type === `FunctionDeclaration` ||
      declaration.type === `ClassDeclaration` ||
      declaration.type === `TSEnumDeclaration` ||
      declaration.type === `TSTypeAliasDeclaration` ||
      declaration.type === `TSInterfaceDeclaration`) &&
    declaration.id !== null
  ) {
    return [
      {
        name: declaration.id.name,
        node: declaration.id,
      },
    ];
  }

  return [];
};

const getExportSpecifierName = (specifier) => {
  const exported = specifier.exported;

  if (exported.type === `Identifier`) {
    return exported.name;
  }

  if (typeof exported.value === `string`) {
    return exported.value;
  }

  return null;
};

const getSpecifierExportInfos = (specifiers) =>
  specifiers.flatMap((specifier) => {
    const name = getExportSpecifierName(specifier);

    if (name === null) {
      return [];
    }

    const result = [
      {
        name,
        node: specifier,
      },
    ];

    return result;
  });

const reportRedundantNames = (context, exportInfos) => {
  exportInfos.forEach((exportInfo) => {
    if (!checkIsRedundantDomainName(exportInfo.name)) {
      return;
    }

    context.report({
      node: exportInfo.node,
      messageId: `noRedundantLocalDomainPrefix`,
      data: {
        exportName: exportInfo.name,
      },
    });
  });
};

export const noRedundantLocalDomainPrefixRule = {
  meta: {
    type: `suggestion`,
    docs: {
      description: `Prevent redundant behavior-dataset domain prefixes in package-local public names.`,
    },
    schema: [],
    messages: {
      noRedundantLocalDomainPrefix: `Use package-local domain naming for {{ exportName }} instead of repeating the behavior-dataset package name.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);

    if (!checkIsBehaviorDatasetPackageSource(filename)) {
      return {};
    }

    // The service identity allowlist is exact by design. New service identity
    // exports must be added to both the convention and this rule.
    return {
      ExportNamedDeclaration(node) {
        if (node.declaration !== null) {
          const exportInfos = getDeclarationExportInfos(node.declaration);
          reportRedundantNames(context, exportInfos);

          return;
        }

        const exportInfos = getSpecifierExportInfos(node.specifiers);
        reportRedundantNames(context, exportInfos);
      },
    };
  },
};
