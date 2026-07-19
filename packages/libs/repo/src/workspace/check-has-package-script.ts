import { type WorkspacePackage } from './types';

export type CheckHasPackageScriptProps = {
  readonly packageInfo: WorkspacePackage;
  readonly scriptName: string;
};

export const checkHasPackageScript = (props: CheckHasPackageScriptProps) => {
  const { packageInfo, scriptName } = props;
  const result = packageInfo.packageJson.scripts?.[scriptName] !== undefined;

  return result;
};
