import { checkHasPackageScript } from './check-has-package-script';
import { createTurboFilterArgs } from './create-turbo-filter-args';
import { filterRunnablePackages } from './filter-runnable-packages';
import { type WorkspacePackage } from './types';
export type ExecuteWorkspaceScriptPropsProps = {
  readonly args: readonly string[];
  readonly cwd: string;
  readonly label?: string;
};

export type ExecuteWorkspaceScriptProps = {
  readonly packageInfos: readonly WorkspacePackage[];
  readonly repoRoot: string;
  readonly runCommand: (props: ExecuteWorkspaceScriptPropsProps) => number;
  readonly scriptName: string;
};

export const executeWorkspaceScript = (props: ExecuteWorkspaceScriptProps) => {
  const { packageInfos, repoRoot, runCommand, scriptName } = props;
  const runnablePackages = filterRunnablePackages(packageInfos).filter(
    (packageInfo) => checkHasPackageScript({ packageInfo, scriptName }),
  );

  if (runnablePackages.length === 0) {
    console.log(`\nNo staged workspaces expose a ${scriptName} script.`);
    return 0;
  }

  const turboFilterArgs = createTurboFilterArgs(runnablePackages);
  const status = runCommand({
    args: [`bunx`, `turbo`, `run`, scriptName, ...turboFilterArgs],
    cwd: repoRoot,
    label: `${scriptName} staged workspaces`,
  });

  return status;
};
