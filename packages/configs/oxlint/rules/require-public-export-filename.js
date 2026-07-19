import {
  checkIsCapitalCase,
  checkIsDeclarationFilename,
  checkHasTemplatePlaceholderName,
  checkIsIndexFilename,
  checkIsMainFilename,
  checkIsTestFilename,
  checkIsTypeScriptSourceFilename,
  getPackageSrcPath,
  getRuleFilename,
  getSourceFileExtension,
  getSourceFileStem,
  getSourcePathSegments,
  toKebabCase,
} from './rule-path-helpers.js';

const skippedImplementationStems = new Set([
  `constants`,
  `errors`,
  `schema`,
  `schemas`,
  `types`,
]);

const predicateNamePattern = /^(?:check)?(?:Is|Has|Can|Should)[A-Z]/u;
const constantNamePattern = /^[A-Z][A-Z0-9_]*$/u;

const getIdentifierPatternNames = (node) => {
  if (node.type === `Identifier`) {
    return [node.name];
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

const checkIsTypePredicateReturn = (node) =>
  node?.returnType?.typeAnnotation?.type === `TSTypePredicate`;

const checkIsPredicateExport = (name, node) =>
  predicateNamePattern.test(name) || checkIsTypePredicateReturn(node);

const getVariableExportInfos = (declaration) =>
  declaration.declarations.flatMap((declarator) =>
    getIdentifierPatternNames(declarator.id).map((name) => ({
      name,
      node: declarator.id,
      checkIsPredicate: checkIsPredicateExport(name, declarator.init),
      checkIsConstant: constantNamePattern.test(name),
    })),
  );

const getDeclarationExportInfos = (declaration) => {
  if (declaration.type === `VariableDeclaration`) {
    return getVariableExportInfos(declaration);
  }

  if (
    (declaration.type === `FunctionDeclaration` ||
      declaration.type === `ClassDeclaration` ||
      declaration.type === `TSEnumDeclaration`) &&
    declaration.id !== null
  ) {
    return [
      {
        name: declaration.id.name,
        node: declaration.id,
        checkIsPredicate: checkIsPredicateExport(
          declaration.id.name,
          declaration,
        ),
        checkIsConstant: false,
      },
    ];
  }

  return [];
};

const getSpecifierExportInfos = (specifiers) =>
  specifiers.flatMap((specifier) => {
    if (specifier.exportKind === `type`) {
      return [];
    }

    const name = getExportSpecifierName(specifier);

    if (name === null) {
      return [];
    }

    return [
      {
        name,
        node: specifier,
        checkIsPredicate: predicateNamePattern.test(name),
        checkIsConstant: constantNamePattern.test(name),
      },
    ];
  });

const checkIsSkippedImplementationFile = (filename) => {
  const isIndexFilename = checkIsIndexFilename(filename);
  const isMainFilename = checkIsMainFilename(filename);
  const isDeclarationFilename = checkIsDeclarationFilename(filename);
  const isTestFilename = checkIsTestFilename(filename);

  if (
    isIndexFilename ||
    isMainFilename ||
    isDeclarationFilename ||
    isTestFilename
  ) {
    return true;
  }

  const fileStem = getSourceFileStem(filename);
  const isSkippedImplementationStem = skippedImplementationStems.has(fileStem);

  if (
    isSkippedImplementationStem ||
    fileStem.endsWith(`-schema`) ||
    fileStem.endsWith(`-schemas`) ||
    fileStem === `constants-test` ||
    checkHasTemplatePlaceholderName(fileStem)
  ) {
    return true;
  }

  const packageSrcPath = getPackageSrcPath(filename);

  if (packageSrcPath === null) {
    return false;
  }

  const segments = getSourcePathSegments(packageSrcPath.srcPath);
  const isTestSupportFile =
    segments[0] === `test` || segments[0] === `test-support`;

  const isTemplatePlaceholderFile = segments.some((segment) =>
    checkHasTemplatePlaceholderName(segment),
  );

  return isTestSupportFile || isTemplatePlaceholderFile;
};

const checkDoesFilenameMatchExport = (filename, exportName) => {
  const fileStem = getSourceFileStem(filename);
  const fileExtension = getSourceFileExtension(filename);
  const expectedStem = toKebabCase(exportName);

  if (fileStem === expectedStem) {
    return true;
  }

  const isCapitalCaseFileStem = checkIsCapitalCase(fileStem);

  return (
    fileExtension === `.tsx` && isCapitalCaseFileStem && fileStem === exportName
  );
};

export const requirePublicExportFilenameRule = {
  meta: {
    type: `suggestion`,
    docs: {
      description: `Require implementation export shape to match file names.`,
    },
    schema: [],
    messages: {
      requireSingleRuntimeExport: `Implementation files must expose at most one public runtime export.`,
      requireInlineRuntimeExport: `Implementation files must use inline public runtime exports instead of local export lists or re-exports.`,
      requireExportFilename: `Implementation filename must match the public runtime export name: {{ expectedFilename }}.`,
      requireCheckPredicateFilename: `Predicate and type guard implementation filenames must start with check-.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);
    const isTypeScriptSourceFilename =
      checkIsTypeScriptSourceFilename(filename);
    const packageSrcPath = getPackageSrcPath(filename);
    const isSkippedImplementationFile =
      checkIsSkippedImplementationFile(filename);

    if (
      !isTypeScriptSourceFilename ||
      packageSrcPath === null ||
      isSkippedImplementationFile
    ) {
      return {};
    }

    let runtimeExports = [];

    return {
      'ExportAllDeclaration'(node) {
        context.report({
          node,
          messageId: `requireInlineRuntimeExport`,
        });
      },

      'ExportNamedDeclaration'(node) {
        if (node.exportKind === `type`) {
          return;
        }

        if (node.source !== null) {
          context.report({
            node,
            messageId: `requireInlineRuntimeExport`,
          });

          return;
        }

        if (node.declaration !== null) {
          runtimeExports = [
            ...runtimeExports,
            ...getDeclarationExportInfos(node.declaration).filter(
              (exportInfo) => exportInfo.checkIsConstant === false,
            ),
          ];

          return;
        }

        const specifierExportInfos = getSpecifierExportInfos(
          node.specifiers,
        ).filter((exportInfo) => exportInfo.checkIsConstant === false);

        if (specifierExportInfos.length === 0) {
          return;
        }

        runtimeExports = [...runtimeExports, ...specifierExportInfos];

        context.report({
          node,
          messageId: `requireInlineRuntimeExport`,
        });
      },

      'Program:exit'(node) {
        if (runtimeExports.length > 1) {
          context.report({
            node: runtimeExports[1]?.node ?? node,
            messageId: `requireSingleRuntimeExport`,
          });
        }

        const runtimeExport = runtimeExports[0];

        if (runtimeExport === undefined) {
          return;
        }

        const fileStem = getSourceFileStem(filename);
        const isPredicateFilename = fileStem.startsWith(`check-`);

        if (runtimeExport.checkIsPredicate && !isPredicateFilename) {
          context.report({
            node: runtimeExport.node,
            messageId: `requireCheckPredicateFilename`,
          });

          return;
        }

        const doesFilenameMatchExport = checkDoesFilenameMatchExport(
          filename,
          runtimeExport.name,
        );

        if (doesFilenameMatchExport) {
          return;
        }

        const expectedFilename = `${toKebabCase(runtimeExport.name)}${getSourceFileExtension(filename)}`;

        context.report({
          node: runtimeExport.node,
          messageId: `requireExportFilename`,
          data: {
            expectedFilename,
          },
        });
      },
    };
  },
};
