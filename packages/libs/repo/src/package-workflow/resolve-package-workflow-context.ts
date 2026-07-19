import {
  readWorkspacePackages,
  resolveCurrentWorkspacePackage,
  resolveWorkspaceRepoRoot,
} from '../workspace';
import { type PackageWorkflowContext } from './types';

export type ResolvePackageWorkflowContextProps = {
  readonly cwd: string;
};

export const resolvePackageWorkflowContext = async (
  props: ResolvePackageWorkflowContextProps,
) => {
  const { cwd } = props;
  const repoRoot = await resolveWorkspaceRepoRoot({ cwd });

  if (repoRoot === null) {
    return null;
  }

  const packageInfos = readWorkspacePackages({ repoRoot });
  const packageInfo = resolveCurrentWorkspacePackage({
    cwd,
    packageInfos,
    repoRoot,
  });

  if (packageInfo === null) {
    console.error(`No workspace package found for ${cwd}`);
    return null;
  }

  const result: PackageWorkflowContext = {
    packageInfo,
    repoRoot,
  };

  return result;
};
