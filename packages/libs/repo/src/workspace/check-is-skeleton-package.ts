import { type WorkspacePackage } from './types';

export const checkIsSkeletonPackage = (packageInfo: WorkspacePackage) => {
  const result =
    packageInfo.directoryName.includes(`__skeleton`) ||
    packageInfo.name.includes(`__skeleton`);

  return result;
};
