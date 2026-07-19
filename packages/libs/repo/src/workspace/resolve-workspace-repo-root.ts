import { PATHS_RESULT_STATUS_ERROR, findRepoRoot } from '../paths';

export type ResolveWorkspaceRepoRootProps = {
  readonly cwd: string;
};

export const resolveWorkspaceRepoRoot = async (
  props: ResolveWorkspaceRepoRootProps,
) => {
  const { cwd } = props;
  const findRepoRootResult = await findRepoRoot({ startPath: cwd });
  const hasError = findRepoRootResult.status === PATHS_RESULT_STATUS_ERROR;

  if (hasError) {
    const { error } = findRepoRootResult;

    console.error(error.message);
    return null;
  }

  const { repoRoot } = findRepoRootResult.data;
  return repoRoot;
};
