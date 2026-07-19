import path from 'node:path';

import {
  getPackageSrcPath,
  getRuleFilename,
  getSourcePathSegments,
} from './rule-path-helpers.js';

const publicPackageSubpaths = new Set([
  `@jearle/lib-postgres/test`,
  `@jearle/service-authentication/test`,
]);

const codeImportExtensions = new Set([
  `.cjs`,
  `.cts`,
  `.js`,
  `.jsx`,
  `.mjs`,
  `.mts`,
  `.ts`,
  `.tsx`,
]);

const checkIsIgnoredImportSource = (source) => {
  const extension = path.posix.extname(source);

  return extension.length > 0 && !codeImportExtensions.has(extension);
};

const getImportSource = (node) => {
  if (
    (node.type === `ImportDeclaration` ||
      node.type === `ExportNamedDeclaration` ||
      node.type === `ExportAllDeclaration`) &&
    node.source?.type === `Literal` &&
    typeof node.source.value === `string`
  ) {
    return node.source.value;
  }

  if (
    node.type === `ImportExpression` &&
    node.source.type === `Literal` &&
    typeof node.source.value === `string`
  ) {
    return node.source.value;
  }

  if (node.type === `TSImportType`) {
    const sourceNode = node.source;

    if (sourceNode.type === `Literal` && typeof sourceNode.value === `string`) {
      return sourceNode.value;
    }

    if (
      sourceNode.type === `TSLiteralType` &&
      sourceNode.literal.type === `Literal` &&
      typeof sourceNode.literal.value === `string`
    ) {
      return sourceNode.literal.value;
    }
  }

  return null;
};

const checkIsPublicPackageImport = (source) => {
  const packageMatch = source.match(/^@jearle\/[^/]+(?:\/(?<subpath>.*))?$/u);
  const subpath = packageMatch?.groups?.subpath;

  if (packageMatch === null || subpath === undefined) {
    return true;
  }

  const isPublicPackageSubpath = publicPackageSubpaths.has(source);

  if (isPublicPackageSubpath) {
    return true;
  }

  const isNestedSubpath = subpath.includes(`/`);

  if (isNestedSubpath) {
    return false;
  }

  return subpath !== `src` && subpath !== `index`;
};

const getResolvedRelativeSourcePath = (importerSrcPath, source) => {
  const importerDirectory = path.posix.dirname(importerSrcPath);
  const result = path.posix.normalize(
    path.posix.join(importerDirectory, source),
  );

  return result;
};

const checkIsPublicModuleImportTarget = (targetSegments) => {
  if (targetSegments.length === 1) {
    return true;
  }

  if (targetSegments.length !== 2) {
    return false;
  }

  return (
    targetSegments[1] === `index` ||
    targetSegments[1] === `index.ts` ||
    targetSegments[1] === `index.tsx`
  );
};

const checkIsAllowedRelativeImport = (filename, source) => {
  const isRelativeImport = source.startsWith(`.`);

  if (!isRelativeImport) {
    return true;
  }

  const packageSrcPath = getPackageSrcPath(filename);

  if (packageSrcPath === null) {
    return true;
  }

  const resolvedSourcePath = getResolvedRelativeSourcePath(
    packageSrcPath.srcPath,
    source,
  );

  const escapesPackageSrc = resolvedSourcePath.startsWith(`..`);

  if (escapesPackageSrc) {
    return false;
  }

  const importerSegments = getSourcePathSegments(packageSrcPath.srcPath);
  const targetSegments = getSourcePathSegments(resolvedSourcePath);
  const importerModuleName = importerSegments[0] ?? null;
  const targetModuleName = targetSegments[0] ?? null;

  const isPackageRootTarget = targetModuleName === null;

  if (isPackageRootTarget) {
    return true;
  }

  const isSameModuleImport = importerModuleName === targetModuleName;

  if (isSameModuleImport) {
    return true;
  }

  const isPublicModuleImportTarget =
    checkIsPublicModuleImportTarget(targetSegments);

  return isPublicModuleImportTarget;
};

const checkIsAllowedImport = (filename, source) => {
  const isIgnoredImportSource = checkIsIgnoredImportSource(source);

  if (isIgnoredImportSource) {
    return true;
  }

  const isMonorepoPackageImport = source.startsWith(`@jearle/`);

  if (isMonorepoPackageImport) {
    return checkIsPublicPackageImport(source);
  }

  return checkIsAllowedRelativeImport(filename, source);
};

const createImportVisitor = (context, filename) => (node) => {
  const source = getImportSource(node);

  if (source === null) {
    return;
  }

  const isAllowedImport = checkIsAllowedImport(filename, source);

  if (isAllowedImport) {
    return;
  }

  context.report({
    node,
    messageId: `preferPublicEntrypointImport`,
  });
};

export const preferPublicEntrypointImportsRule = {
  meta: {
    type: `suggestion`,
    docs: {
      description: `Prefer package and module public entrypoint imports.`,
    },
    schema: [],
    messages: {
      preferPublicEntrypointImport: `Import through the package or module public index entrypoint instead of an internal file.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);
    const visitImport = createImportVisitor(context, filename);

    return {
      ExportAllDeclaration: visitImport,
      ExportNamedDeclaration: visitImport,
      ImportDeclaration: visitImport,
      ImportExpression: visitImport,
      TSImportType: visitImport,
    };
  },
};
