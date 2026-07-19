import path from 'node:path';

import { findAncestorDirectory, getPathExists } from '@jearle/util-fs';

import {
  PACKAGES_DIRECTORY_NAME,
  PACKAGE_JSON_FILE_NAME,
  PATHS_RESULT_STATUS_ERROR,
  PATHS_RESULT_STATUS_SUCCESS,
} from './constants';
import { createFindRepoRootFailedError } from './errors';
import { type FindRepoRootResult } from './types';

export type FindRepoRootProps = {
  readonly startPath: string;
};

export const findRepoRoot = async (
  props: FindRepoRootProps,
): Promise<FindRepoRootResult> => {
  const { startPath } = props;
  const directoryPath = path.resolve(startPath);
  const findAncestorDirectoryResult = await findAncestorDirectory({
    startPath: directoryPath,
    checkIsAncestorDirectory: async ({ directoryPath }) => {
      const packageJsonPath = path.join(directoryPath, PACKAGE_JSON_FILE_NAME);
      const packagesPath = path.join(directoryPath, PACKAGES_DIRECTORY_NAME);
      const hasPackageJson = await getPathExists({ path: packageJsonPath });
      const hasPackages = await getPathExists({ path: packagesPath });
      const result = hasPackageJson && hasPackages;

      return result;
    },
  });
  const hasFindAncestorDirectoryError =
    findAncestorDirectoryResult.status === PATHS_RESULT_STATUS_ERROR;

  if (hasFindAncestorDirectoryError) {
    const { error } = findAncestorDirectoryResult;
    const result: FindRepoRootResult = {
      status: PATHS_RESULT_STATUS_ERROR,
      error,
    };
    return result;
  }

  const repoRoot = findAncestorDirectoryResult.data;
  const hasRepoRoot = repoRoot !== null;

  if (hasRepoRoot === false) {
    const error = createFindRepoRootFailedError({ directoryPath });
    const result: FindRepoRootResult = {
      status: PATHS_RESULT_STATUS_ERROR,
      error,
    };
    return result;
  }

  const result: FindRepoRootResult = {
    status: PATHS_RESULT_STATUS_SUCCESS,
    data: {
      repoRoot,
    },
  };

  return result;
};
