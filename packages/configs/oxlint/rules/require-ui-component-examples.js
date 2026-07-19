import fs from 'node:fs';
import path from 'node:path';

import {
  checkIsCapitalCase,
  checkIsTestFilename,
  getPackageSrcPath,
  getRuleFilename,
} from './rule-path-helpers.js';

const frontendComponentPackageFamilies = new Set([`composites`, `uis`]);

const checkIsSkippedComponentFilename = (filename) => {
  const basename = path.posix.basename(filename);
  const isSkippedComponentFilename =
    checkIsTestFilename(filename) ||
    basename === `App.tsx` ||
    basename === `Example.tsx` ||
    basename.endsWith(`Example.tsx`);

  return isSkippedComponentFilename;
};

const checkIsFrontendComponentFilename = (filename) => {
  const isTsxFilename = filename.endsWith(`.tsx`);
  const isSkippedComponentFilename = checkIsSkippedComponentFilename(filename);

  if (!isTsxFilename || isSkippedComponentFilename) {
    return false;
  }

  const packageSrcPath = getPackageSrcPath(filename);

  const isOutsideFrontendComponentPackage =
    packageSrcPath === null ||
    !frontendComponentPackageFamilies.has(packageSrcPath.family);

  if (isOutsideFrontendComponentPackage) {
    return false;
  }

  const isAppShellComponent = packageSrcPath.srcPath.startsWith(`app/`);

  return !isAppShellComponent;
};

const getExportedComponentNames = (node) => {
  if (node.type !== `ExportNamedDeclaration`) {
    return [];
  }

  if (node.exportKind === `type`) {
    return [];
  }

  const declaration = node.declaration;

  if (declaration?.type === `FunctionDeclaration`) {
    const name = declaration.id?.name;
    const isComponentName = name !== undefined && checkIsCapitalCase(name);

    return isComponentName ? [name] : [];
  }

  if (declaration?.type === `ClassDeclaration`) {
    const name = declaration.id?.name;
    const isComponentName = name !== undefined && checkIsCapitalCase(name);

    return isComponentName ? [name] : [];
  }

  if (declaration?.type !== `VariableDeclaration`) {
    const result = node.specifiers
      .map((specifier) => {
        if (
          specifier.type !== `ExportSpecifier` ||
          specifier.exportKind === `type`
        ) {
          return null;
        }

        if (specifier.exported.type === `Identifier`) {
          return specifier.exported.name;
        }

        if (
          specifier.exported.type === `Literal` &&
          typeof specifier.exported.value === `string`
        ) {
          return specifier.exported.value;
        }

        return null;
      })
      .filter((name) => name !== null && checkIsCapitalCase(name));

    return result;
  }

  const result = declaration.declarations
    .map((variableDeclarator) =>
      variableDeclarator.id.type === `Identifier`
        ? variableDeclarator.id.name
        : null,
    )
    .filter((name) => name !== null && checkIsCapitalCase(name));

  return result;
};

const getConfiguredExampleFilenames = (context) => {
  const option = context.options[0];

  if (option?.exampleFilenames === undefined) {
    return new Set();
  }

  const result = new Set(
    option.exampleFilenames.map((filename) =>
      filename.replaceAll(path.sep, `/`),
    ),
  );

  return result;
};

const checkExampleExists = (exampleFilename, configuredExampleFilenames) => {
  if (configuredExampleFilenames.has(exampleFilename)) {
    return true;
  }

  return fs.existsSync(exampleFilename);
};

export const requireUiComponentExamplesRule = {
  meta: {
    type: `suggestion`,
    docs: {
      description: `Require public UI component folders to include a co-located Example.tsx.`,
    },
    schema: [
      {
        type: `object`,
        properties: {
          exampleFilenames: {
            type: `array`,
            items: { type: `string` },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      requireUiComponentExample: `Public UI component folders must include a co-located Example.tsx.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);
    const isFrontendComponentFilename =
      checkIsFrontendComponentFilename(filename);

    if (!isFrontendComponentFilename) {
      return {};
    }

    const configuredExampleFilenames = getConfiguredExampleFilenames(context);
    const exampleFilename = path.posix.join(
      path.posix.dirname(filename),
      `Example.tsx`,
    );

    return {
      ExportNamedDeclaration(node) {
        const exportedComponentNames = getExportedComponentNames(node);

        if (exportedComponentNames.length === 0) {
          return;
        }

        const exampleExists = checkExampleExists(
          exampleFilename,
          configuredExampleFilenames,
        );

        if (exampleExists) {
          return;
        }

        context.report({
          node,
          messageId: `requireUiComponentExample`,
        });
      },
    };
  },
};
