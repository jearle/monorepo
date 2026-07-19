import {
  type WorkspacePackage,
  normalizeFilePaths,
  resolveAffectedPackages,
} from '../workspace';

export type SelectPackageInfosProps = {
  readonly cwd: string;
  readonly packageInfos: readonly WorkspacePackage[];
  readonly rawFilePaths: readonly string[];
  readonly repoRoot: string;
};

export const selectPackageInfos = (props: SelectPackageInfosProps) => {
  const { cwd, packageInfos, rawFilePaths, repoRoot } = props;

  if (rawFilePaths.length === 0) {
    return packageInfos;
  }

  const filePaths = normalizeFilePaths({
    cwd,
    repoRoot,
    filePaths: rawFilePaths,
  });
  const result = resolveAffectedPackages({
    filePaths,
    packageInfos,
  });

  return result;
};
