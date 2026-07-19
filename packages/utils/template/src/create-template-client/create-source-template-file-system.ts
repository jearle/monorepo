import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { access, readFile, realpath } from 'node:fs/promises';
import path from 'node:path';

import { type FS } from 'liquidjs';

import {
  TEMPLATE_ABSOLUTE_IMPORT_ERROR,
  TEMPLATE_IMPORT_ERROR_CODE,
} from '../errors';
import { createSourceTemplateFailure } from './errors';

export type CreateSourceTemplateFileSystemProps = {
  readonly onRead: (canonicalPath: string, content: string) => void;
};

export const createSourceTemplateFileSystem = (
  props: CreateSourceTemplateFileSystemProps,
): FS => {
  const { onRead } = props;
  const canonicalize = (filePath: string) => {
    const result = existsSync(filePath)
      ? realpathSync(filePath)
      : path.resolve(filePath);

    return result;
  };
  const checkIsAllowed = (filePath: string) => {
    const canonicalPath = canonicalize(filePath);
    const result = existsSync(canonicalPath);

    return result;
  };
  const readCanonicalFile = async (filePath: string) => {
    const canonicalPath = await realpath(filePath);
    const content = await readFile(canonicalPath, `utf8`);

    onRead(canonicalPath, content);

    return content;
  };
  const readCanonicalFileSync = (filePath: string) => {
    const canonicalPath = realpathSync(filePath);
    const content = readFileSync(canonicalPath, `utf8`);

    onRead(canonicalPath, content);

    return content;
  };
  const resolveFile = (
    directoryPath: string,
    filePath: string,
    ext: string | undefined,
  ) => {
    if (path.isAbsolute(filePath)) {
      throw createSourceTemplateFailure(
        TEMPLATE_ABSOLUTE_IMPORT_ERROR,
        TEMPLATE_IMPORT_ERROR_CODE,
      );
    }

    const normalizedExtension = ext ?? ``;
    const extendedPath = `${filePath}${normalizedExtension}`;
    const shouldUseExtension =
      path.extname(filePath) === `` &&
      normalizedExtension !== `` &&
      existsSync(path.resolve(directoryPath, extendedPath));
    const pathWithExtension = shouldUseExtension ? extendedPath : filePath;
    const candidatePath = path.resolve(directoryPath, pathWithExtension);
    const resolvedPath = existsSync(candidatePath)
      ? realpathSync(candidatePath)
      : candidatePath;

    return resolvedPath;
  };

  const result: FS = {
    contains: async (_root, filePath) => checkIsAllowed(filePath),
    containsSync: (_root, filePath) => checkIsAllowed(filePath),
    dirname: path.dirname,
    exists: async (filePath) => {
      try {
        await access(filePath);

        return true;
      } catch {
        return false;
      }
    },
    existsSync,
    readFile: readCanonicalFile,
    readFileSync: readCanonicalFileSync,
    resolve: resolveFile,
    sep: path.sep,
  };

  return result;
};
