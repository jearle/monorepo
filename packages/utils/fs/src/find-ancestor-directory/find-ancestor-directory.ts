import path from 'node:path';

import { toAsyncResult } from '@jearle/util-result';

import {
  type CheckIsAncestorDirectory,
  type FindAncestorDirectoryResult,
} from './types';

type FindAncestorDirectoryPathProps = {
  readonly directoryPath: string;
  readonly checkIsAncestorDirectory: CheckIsAncestorDirectory;
};

const findAncestorDirectoryPath = async (
  props: FindAncestorDirectoryPathProps,
): Promise<string | null> => {
  const { directoryPath, checkIsAncestorDirectory } = props;
  const isMatch = await checkIsAncestorDirectory({ directoryPath });

  if (isMatch) {
    const result = directoryPath;
    return result;
  }

  const parentDirectoryPath = path.dirname(directoryPath);
  const isFilesystemRoot = parentDirectoryPath === directoryPath;

  if (isFilesystemRoot) {
    const result = null;
    return result;
  }

  const result = await findAncestorDirectoryPath({
    directoryPath: parentDirectoryPath,
    checkIsAncestorDirectory,
  });

  return result;
};

export type FindAncestorDirectoryProps = {
  readonly startPath: string;
  readonly checkIsAncestorDirectory: CheckIsAncestorDirectory;
};

export const findAncestorDirectory = async (
  props: FindAncestorDirectoryProps,
): Promise<FindAncestorDirectoryResult> => {
  const { startPath, checkIsAncestorDirectory } = props;
  const result = await toAsyncResult({
    operation: async () => {
      const directoryPath = path.resolve(startPath);
      const ancestorDirectoryPath = await findAncestorDirectoryPath({
        directoryPath,
        checkIsAncestorDirectory,
      });

      return ancestorDirectoryPath;
    },
  });

  return result;
};
