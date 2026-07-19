import { type WorkspacePackage } from './types';

export type ResolveAffectedPackagesProps = {
  readonly filePaths: readonly string[];
  readonly packageInfos: readonly WorkspacePackage[];
};

export const resolveAffectedPackages = (
  props: ResolveAffectedPackagesProps,
) => {
  const { filePaths, packageInfos } = props;
  const result = packageInfos.filter((packageInfo) =>
    filePaths.some(
      (filePath) =>
        filePath === packageInfo.relativeDirectory ||
        filePath.startsWith(`${packageInfo.relativeDirectory}/`),
    ),
  );

  return result;
};
