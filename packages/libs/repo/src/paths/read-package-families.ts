import { readDirectoryNames } from '@jearle/util-fs';

import {
  PACKAGE_DIRECTORY_IGNORED_NAMES,
  PATHS_RESULT_STATUS_ERROR,
  PATHS_RESULT_STATUS_SUCCESS,
} from './constants';
import { resolvePackageFamilyPath } from './resolve-package-family-path';
import { type ReadPackageFamiliesResult } from './types';

export type ReadPackageFamiliesProps = {
  readonly repoRoot: string;
};

export const readPackageFamilies = async (
  props: ReadPackageFamiliesProps,
): Promise<ReadPackageFamiliesResult> => {
  const { repoRoot } = props;
  const { packageFamilyPath } = resolvePackageFamilyPath({
    repoRoot,
    packageFamily: ``,
  });
  const readDirectoryNamesResult = await readDirectoryNames({
    directoryPath: packageFamilyPath,
    ignoredNames: PACKAGE_DIRECTORY_IGNORED_NAMES,
  });
  const { status } = readDirectoryNamesResult;
  const hasError = status === PATHS_RESULT_STATUS_ERROR;

  if (hasError) {
    const { error } = readDirectoryNamesResult;
    const result: ReadPackageFamiliesResult = {
      status: PATHS_RESULT_STATUS_ERROR,
      error,
    };
    return result;
  }

  const directoryNames = readDirectoryNamesResult.data;
  const packageFamilies = directoryNames;
  const result: ReadPackageFamiliesResult = {
    status: PATHS_RESULT_STATUS_SUCCESS,
    data: {
      packageFamilies,
    },
  };

  return result;
};
