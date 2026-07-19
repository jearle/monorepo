import { checkIsArchivedPackage } from './check-is-archived-package';
import { type WorkspacePackage } from './types';

export const filterRunnablePackages = (
  packageInfos: readonly WorkspacePackage[],
) => {
  const result = packageInfos.filter(
    (packageInfo) => checkIsArchivedPackage(packageInfo) === false,
  );

  return result;
};
