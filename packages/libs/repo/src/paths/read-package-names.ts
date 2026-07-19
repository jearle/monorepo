import { readDirectoryNames } from '@jearle/util-fs';

import {
  PACKAGE_DIRECTORY_IGNORED_NAMES,
  PATHS_RESULT_STATUS_ERROR,
  PATHS_RESULT_STATUS_SUCCESS,
} from './constants';
import { resolvePackageFamilyPath } from './resolve-package-family-path';
import { type ReadPackageNamesResult } from './types';

export type ReadPackageNamesProps = {
  readonly repoRoot: string;
  readonly packageFamily: string;
};

export const readPackageNames = async (
  props: ReadPackageNamesProps,
): Promise<ReadPackageNamesResult> => {
  const { repoRoot, packageFamily } = props;
  const { packageFamilyPath } = resolvePackageFamilyPath({
    repoRoot,
    packageFamily,
  });
  const readDirectoryNamesResult = await readDirectoryNames({
    directoryPath: packageFamilyPath,
    ignoredNames: PACKAGE_DIRECTORY_IGNORED_NAMES,
  });
  const { status } = readDirectoryNamesResult;
  const hasError = status === PATHS_RESULT_STATUS_ERROR;

  if (hasError) {
    const { error } = readDirectoryNamesResult;
    const result: ReadPackageNamesResult = {
      status: PATHS_RESULT_STATUS_ERROR,
      error,
    };
    return result;
  }

  const directoryNames = readDirectoryNamesResult.data;
  const packageNames = directoryNames;
  const result: ReadPackageNamesResult = {
    status: PATHS_RESULT_STATUS_SUCCESS,
    data: {
      packageNames,
    },
  };

  return result;
};
