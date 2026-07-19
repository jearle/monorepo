import {
  RESULT_STATUS_ERROR,
  createResultSuccess,
  wrapResultError,
} from '@jearle/util-result';

import { readDirectoryEntries } from '../read-directory-entries';

import { type ReadDirectoryNamesResult } from './types';

export type ReadDirectoryNamesProps = {
  readonly directoryPath: string;
  readonly ignoredNames?: readonly string[];
  readonly includeHidden?: boolean;
};

export const readDirectoryNames = async (
  props: ReadDirectoryNamesProps,
): Promise<ReadDirectoryNamesResult> => {
  const { directoryPath, ignoredNames = [], includeHidden = false } = props;
  const readDirectoryEntriesResult = await readDirectoryEntries({
    directoryPath,
  });
  const hasError = readDirectoryEntriesResult.status === RESULT_STATUS_ERROR;

  if (hasError) {
    const { error } = readDirectoryEntriesResult;
    const result = wrapResultError({ error });

    return result;
  }

  const { data: entries } = readDirectoryEntriesResult;
  const directoryEntries = entries.filter((entry) => {
    const result = entry.isDirectory();

    return result;
  });
  const directoryNames = directoryEntries.map((entry) => entry.name);
  const visibleDirectoryNames = directoryNames.filter((directoryName) => {
    const isIgnoredName = ignoredNames.includes(directoryName);
    const isHiddenName = directoryName.startsWith(`.`);
    const shouldHideName = includeHidden === false && isHiddenName;
    const result = isIgnoredName === false && shouldHideName === false;

    return result;
  });
  const sortedDirectoryNames = visibleDirectoryNames.toSorted((a, b) => {
    const result = a.localeCompare(b);

    return result;
  });
  const result = createResultSuccess({ data: sortedDirectoryNames });

  return result;
};
