import path from 'node:path';

const packageSrcPathPattern =
  /(?:^|\/)packages\/(?<family>[^/]+)\/(?<packageName>[^/]+)\/src(?:\/(?<srcPath>.*))?$/u;

export const getRuleFilename = (context) => {
  const filename =
    context.filename ??
    (typeof context.getFilename === `function` ? context.getFilename() : ``);

  if (filename === `<input>`) {
    return ``;
  }

  return filename.replaceAll(path.sep, `/`);
};

export const getRuleSourceCode = (context) =>
  context.sourceCode ?? context.getSourceCode();

export const getPackageSrcPath = (filename) => {
  const normalizedFilename = filename.replaceAll(path.sep, `/`);
  const match = normalizedFilename.match(packageSrcPathPattern);

  if (match?.groups === undefined) {
    return null;
  }

  const srcPath = match.groups.srcPath ?? ``;
  const result = {
    family: match.groups.family,
    packageName: match.groups.packageName,
    srcPath,
  };

  return result;
};

export const getSourcePathSegments = (srcPath) =>
  srcPath.split(`/`).filter((segment) => segment.length > 0);

export const checkIsKebabCase = (value) =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(value);

export const checkIsCapitalCase = (value) => /^[A-Z][A-Za-z0-9]*$/u.test(value);

const templatePlaceholderPattern = /__[a-z0-9]+(?:-[a-z0-9]+)*(?:__)?/u;
const exactTemplatePlaceholderPattern = /^__[a-z0-9]+(?:-[a-z0-9]+)*(?:__)?$/u;
const knownAcronymPattern =
  /(API|CLI|CSV|HTML|HTTP|ID|JSON|LLM|SQL|SSE|TTY|UI|URL)/gu;

export const checkIsTemplatePlaceholderName = (value) =>
  exactTemplatePlaceholderPattern.test(value);

export const checkHasTemplatePlaceholderName = (value) =>
  templatePlaceholderPattern.test(value);

export const getSourceFileExtension = (filename) => {
  if (filename.endsWith(`.d.ts`)) {
    return `.d.ts`;
  }

  return path.posix.extname(filename);
};

export const getSourceFileStem = (filename) => {
  const basename = path.posix.basename(filename);

  if (basename.endsWith(`.d.ts`)) {
    return basename.slice(0, -`.d.ts`.length);
  }

  const extension = path.posix.extname(basename);
  const result = basename.slice(0, -extension.length);

  return result;
};

export const stripTestSuffix = (stem) =>
  stem.replace(/\.(?:e2e|integration)?\.test$/u, ``).replace(/\.test$/u, ``);

export const stripSourceRoleSuffix = (stem) =>
  stripTestSuffix(stem).replace(/\.worker$/u, ``);

export const toKebabCase = (value) =>
  value
    .replace(knownAcronymPattern, `-$1-`)
    .replace(/([A-Z]+)([A-Z][a-z])/gu, `$1-$2`)
    .replace(/([a-z0-9])([A-Z])/gu, `$1-$2`)
    .replaceAll(`_`, `-`)
    .replace(/-+/gu, `-`)
    .replace(/^-|-$/gu, ``)
    .toLowerCase();

export const checkIsTypeScriptSourceFilename = (filename) =>
  filename.endsWith(`.ts`) || filename.endsWith(`.tsx`);

export const checkIsDeclarationFilename = (filename) =>
  filename.endsWith(`.d.ts`);

export const checkIsTestFilename = (filename) =>
  filename.endsWith(`.test.ts`) ||
  filename.endsWith(`.test.tsx`) ||
  filename.endsWith(`.integration.test.ts`) ||
  filename.endsWith(`.integration.test.tsx`) ||
  filename.endsWith(`.e2e.test.ts`) ||
  filename.endsWith(`.e2e.test.tsx`);

export const checkIsIndexFilename = (filename) =>
  filename.endsWith(`/index.ts`) || filename.endsWith(`/index.tsx`);

export const checkIsMainFilename = (filename) =>
  filename.endsWith(`/main.ts`) || filename.endsWith(`/main.tsx`);
