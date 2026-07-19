import { type WorkspacePackage } from './types';

export const createTurboFilterArgs = (
  packageInfos: readonly WorkspacePackage[],
) => {
  const result = packageInfos.map(
    (packageInfo) => `--filter=${packageInfo.name}`,
  );
  return result;
};
