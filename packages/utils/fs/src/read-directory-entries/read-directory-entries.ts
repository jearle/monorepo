import { readdir } from 'node:fs/promises';

import { toAsyncResult } from '@jearle/util-result';

import { type ReadDirectoryEntriesResult } from './types';

export type ReadDirectoryEntriesProps = {
  readonly directoryPath: string;
};

export const readDirectoryEntries = async (
  props: ReadDirectoryEntriesProps,
): Promise<ReadDirectoryEntriesResult> => {
  const { directoryPath } = props;
  const result = await toAsyncResult({
    operation: async () => readdir(directoryPath, { withFileTypes: true }),
  });

  return result;
};
