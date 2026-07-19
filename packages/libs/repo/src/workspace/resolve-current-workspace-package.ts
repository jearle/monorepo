import path from 'node:path';

import { type WorkspacePackage } from './types';

const checkContainsCurrentDirectory = (
  relativeDirectory: string,
  relativeCwd: string,
) => {
  const result =
    relativeCwd === relativeDirectory ||
    relativeCwd.startsWith(`${relativeDirectory}/`);

  return result;
};
export type ResolveCurrentWorkspacePackageProps = {
  readonly cwd: string;
  readonly packageInfos: readonly WorkspacePackage[];
  readonly repoRoot: string;
};

export const resolveCurrentWorkspacePackage = (
  props: ResolveCurrentWorkspacePackageProps,
) => {
  const { cwd, packageInfos, repoRoot } = props;
  const absoluteCwd = path.resolve(cwd);
  const relativeCwd = path
    .relative(repoRoot, absoluteCwd)
    .split(path.sep)
    .join(`/`);
  const matchingPackages = packageInfos.filter((packageInfo) =>
    checkContainsCurrentDirectory(packageInfo.relativeDirectory, relativeCwd),
  );
  const sortedPackages = matchingPackages.toSorted((a, b) => {
    const result = b.relativeDirectory.length - a.relativeDirectory.length;

    return result;
  });
  const [result = null] = sortedPackages;

  return result;
};
