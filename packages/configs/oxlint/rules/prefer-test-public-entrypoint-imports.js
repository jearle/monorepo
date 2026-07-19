import fs from 'node:fs';
import path from 'node:path';

import { checkIsTestFilename, getRuleFilename } from './rule-path-helpers.js';

const publicEntrypointImportPattern = /^\.$/u;
const publicEntrypointShorthandPattern = /^\.\/$/u;
const testSupportImportPattern =
  /^\.\/(?:constants-test|test-support|fixtures?|.*fixture.*)(?:\/.*)?$/u;
const codeImportExtensions = new Set([`.js`, `.jsx`, `.ts`, `.tsx`]);
const indexFilenames = [`index.ts`, `index.tsx`];

const checkIsIgnoredImportSource = (source) => {
  const extension = path.posix.extname(source);
  const isNonCodeImport =
    extension.length > 0 && !codeImportExtensions.has(extension);

  return isNonCodeImport;
};

const checkIsAllowedTestLocalImport = (source) => {
  const isLocalImport = source === `.` || source.startsWith(`./`);

  if (!isLocalImport) {
    return true;
  }

  const isIgnoredImportSource = checkIsIgnoredImportSource(source);

  if (isIgnoredImportSource) {
    return true;
  }

  const isAllowedTestLocalImport =
    publicEntrypointImportPattern.test(source) ||
    testSupportImportPattern.test(source);

  return isAllowedTestLocalImport;
};

const getNormalizedLocalSource = (source) => {
  const sourceWithoutExtension = source.replace(/\.(?:js|jsx|ts|tsx)$/u, ``);
  const normalizedSource = sourceWithoutExtension.replace(/\/index$/u, ``);
  const result = normalizedSource;

  return result;
};

const getIndexFilename = (filename) => {
  const directory = path.dirname(filename);
  const result = indexFilenames.find((indexFilename) => {
    const indexPath = path.join(directory, indexFilename);
    const exists = fs.existsSync(indexPath);

    return exists;
  });

  if (result === undefined) {
    return undefined;
  }

  const indexFilename = path.join(directory, result);

  return indexFilename;
};

const getImportedNames = (node) => {
  const importedNames = new Set();

  node.specifiers.forEach((specifier) => {
    if (specifier.type !== `ImportSpecifier`) {
      return;
    }

    const imported = specifier.imported;
    const importedName =
      imported.type === `Identifier` ? imported.name : imported.value;

    importedNames.add(importedName);
  });

  return importedNames;
};

const getExportedName = (specifierText) => {
  const specifierWithoutType = specifierText.replace(/^type\s+/u, ``).trim();
  const specifierParts = specifierWithoutType.split(/\s+as\s+/u);
  const exportedName = specifierParts.at(-1)?.trim();
  const result = exportedName;

  return result;
};

const getPublicExportInfo = (indexText, source) => {
  const normalizedSource = getNormalizedLocalSource(source);
  const namedExports = new Set();
  let hasExportAll = false;

  const exportAllPattern =
    /export\s+(?:type\s+)?\*\s+from\s+[`'"](?<source>[^`'"]+)[`'"]/gu;
  const namedExportPattern =
    /export\s+(?:type\s+)?\{(?<specifiers>[\s\S]*?)\}\s+from\s+[`'"](?<source>[^`'"]+)[`'"]/gu;

  for (const match of indexText.matchAll(exportAllPattern)) {
    const exportSource = match.groups?.source;

    if (exportSource === undefined) {
      continue;
    }

    const normalizedExportSource = getNormalizedLocalSource(exportSource);

    if (normalizedExportSource === normalizedSource) {
      hasExportAll = true;
    }
  }

  for (const match of indexText.matchAll(namedExportPattern)) {
    const exportSource = match.groups?.source;

    if (exportSource === undefined) {
      continue;
    }

    const normalizedExportSource = getNormalizedLocalSource(exportSource);

    if (normalizedExportSource !== normalizedSource) {
      continue;
    }

    const specifiers = match.groups?.specifiers ?? ``;

    specifiers.split(`,`).forEach((specifierText) => {
      const exportedName = getExportedName(specifierText);

      if (exportedName === undefined || exportedName.length === 0) {
        return;
      }

      namedExports.add(exportedName);
    });
  }

  const result = {
    hasExportAll,
    namedExports,
  };

  return result;
};

const checkCanImportThroughPublicEntrypoint = (filename, node, source) => {
  if (publicEntrypointShorthandPattern.test(source)) {
    return true;
  }

  if (node.specifiers.length === 0) {
    return false;
  }

  const indexFilename = getIndexFilename(filename);

  if (indexFilename === undefined) {
    return false;
  }

  const indexText = fs.readFileSync(indexFilename, `utf8`);
  const publicExportInfo = getPublicExportInfo(indexText, source);

  if (publicExportInfo.hasExportAll) {
    return true;
  }

  const importedNames = getImportedNames(node);

  if (importedNames.size === 0) {
    return false;
  }

  const result = [...importedNames].every((importedName) =>
    publicExportInfo.namedExports.has(importedName),
  );

  return result;
};

export const preferTestPublicEntrypointImportsRule = {
  meta: {
    type: `suggestion`,
    docs: {
      description: `Require public behavior tests to import through the local feature entrypoint.`,
    },
    fixable: `code`,
    schema: [],
    messages: {
      preferTestPublicEntrypointImport: `Import public behavior under test from the local feature entrypoint instead of an implementation file or ./ shorthand.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);
    const isTestFilename = checkIsTestFilename(filename);

    if (!isTestFilename) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        if (typeof source !== `string`) {
          return;
        }

        const isAllowedTestLocalImport = checkIsAllowedTestLocalImport(source);

        if (isAllowedTestLocalImport) {
          return;
        }

        const canImportThroughPublicEntrypoint =
          checkCanImportThroughPublicEntrypoint(filename, node, source);

        if (!canImportThroughPublicEntrypoint) {
          return;
        }

        context.report({
          node,
          messageId: `preferTestPublicEntrypointImport`,
          fix(fixer) {
            return fixer.replaceText(node.source, `'.'`);
          },
        });
      },
    };
  },
};
