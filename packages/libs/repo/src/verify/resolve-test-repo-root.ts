import { PATHS_RESULT_STATUS_ERROR, findRepoRoot } from '../paths';

export const resolveTestRepoRoot = async () => {
  const findRepoRootResult = await findRepoRoot({ startPath: process.cwd() });
  const hasError = findRepoRootResult.status === PATHS_RESULT_STATUS_ERROR;

  if (hasError) {
    const { error } = findRepoRootResult;

    throw error;
  }

  const { repoRoot } = findRepoRootResult.data;
  return repoRoot;
};
