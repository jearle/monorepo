import {
  checkIsDeclarationFilename,
  checkIsTestFilename,
  getPackageSrcPath,
  getRuleFilename,
  getSourceFileStem,
} from './rule-path-helpers.js';

const checkIsLocalSchemaFilename = (filename) => {
  const stem = getSourceFileStem(filename);
  const result = stem.endsWith(`-schema`);

  return result;
};

const checkShouldSkipFile = (filename) => {
  const packageSrcPath = getPackageSrcPath(filename);
  const result =
    packageSrcPath === null ||
    packageSrcPath.family === `schemas` ||
    checkIsDeclarationFilename(filename) ||
    checkIsTestFilename(filename) ||
    checkIsLocalSchemaFilename(filename);

  return result;
};

const checkIsSchemaDeclarationName = (node) => {
  const result = node.type === `Identifier` && node.name.endsWith(`Schema`);

  return result;
};

const checkReferencesZod = (node) => {
  if (node === null || node === undefined || typeof node !== `object`) {
    return false;
  }

  if (Array.isArray(node)) {
    const result = node.some((item) => checkReferencesZod(item));

    return result;
  }

  if (
    node.type === `MemberExpression` &&
    node.object?.type === `Identifier` &&
    node.object.name === `z`
  ) {
    return true;
  }

  for (const [key, value] of Object.entries(node)) {
    if (
      key === `parent` ||
      key === `loc` ||
      key === `range` ||
      key === `type`
    ) {
      continue;
    }

    if (checkReferencesZod(value)) {
      return true;
    }
  }

  return false;
};

export const requireLocalSchemaFileNamesRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Require package-local schemas to live in singular -schema files.`,
    },
    schema: [],
    messages: {
      requireLocalSchemaFileName: `Move package-local schemas into a feature file named <x>-schema.ts.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);

    if (checkShouldSkipFile(filename)) {
      return {};
    }

    return {
      VariableDeclarator(node) {
        if (checkIsSchemaDeclarationName(node.id) === false) {
          return;
        }

        if (checkReferencesZod(node.init) === false) {
          return;
        }

        context.report({
          node: node.id,
          messageId: `requireLocalSchemaFileName`,
        });
      },
    };
  },
};
