import { type WorkspacePackage } from './types';

export const checkIsArchivedPackage = (packageInfo: WorkspacePackage) => {
  const result = packageInfo.directoryName.endsWith(`.old`);
  return result;
};
