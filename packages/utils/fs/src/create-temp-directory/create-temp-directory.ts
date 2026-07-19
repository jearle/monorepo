import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { type CreateTempDirectoryOptions } from './types';

export const createTempDirectory = async (
  options: CreateTempDirectoryOptions = {},
) => {
  const { parentDirectoryPath = tmpdir(), prefix = `monorepo-` } = options;
  const directoryPath = await mkdtemp(path.join(parentDirectoryPath, prefix));

  const result = directoryPath;

  return result;
};
