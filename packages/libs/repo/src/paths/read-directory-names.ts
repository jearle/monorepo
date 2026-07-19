import { readDirectoryNames as readFileSystemDirectoryNames } from '@jearle/util-fs';

import {
  PACKAGE_DIRECTORY_IGNORED_NAMES,
  PATHS_RESULT_STATUS_ERROR,
  PATHS_RESULT_STATUS_SUCCESS,
} from './constants';
import { type ReadDirectoryNamesResult } from './types';

export type ReadDirectoryNamesProps = {
  readonly directoryPath: string;
  readonly ignoredNames?: readonly string[];
};

export const readDirectoryNames = async (
  props: ReadDirectoryNamesProps,
): Promise<ReadDirectoryNamesResult> => {
  const { directoryPath, ignoredNames = PACKAGE_DIRECTORY_IGNORED_NAMES } =
    props;
  const readDirectoryNamesResult = await readFileSystemDirectoryNames({
    directoryPath,
    ignoredNames,
  });
  const hasError =
    readDirectoryNamesResult.status === PATHS_RESULT_STATUS_ERROR;

  if (hasError) {
    const { error } = readDirectoryNamesResult;
    const result: ReadDirectoryNamesResult = {
      status: PATHS_RESULT_STATUS_ERROR,
      error,
    };
    return result;
  }

  const { data: directoryNames } = readDirectoryNamesResult;
  const result: ReadDirectoryNamesResult = {
    status: PATHS_RESULT_STATUS_SUCCESS,
    data: {
      directoryNames,
    },
  };
  return result;
};
