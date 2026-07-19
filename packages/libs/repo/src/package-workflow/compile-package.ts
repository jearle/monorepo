import { executeShellCommand } from '../shell-command';
import { checkIsArchivedPackage } from '../workspace';
import { createWorkflowResult } from '../workflow-result';
import { checkHasPackageSource } from './check-has-package-source';
import { resolvePackageWorkflowContext } from './resolve-package-workflow-context';
import { type CompilePackageOptions, type PackageWorkflowProps } from './types';

export type CompilePackageProps = PackageWorkflowProps;
export const compilePackage = async (
  props: CompilePackageProps,
  options: CompilePackageOptions = {},
) => {
  const { cwd } = props;
  const { runCommand = executeShellCommand } = options;
  const context = await resolvePackageWorkflowContext({ cwd });

  if (context === null) {
    const result = createWorkflowResult({ exitCode: 1 });
    return result;
  }

  const { packageInfo } = context;
  const isArchivedPackage = checkIsArchivedPackage(packageInfo);

  if (isArchivedPackage) {
    console.log(`\nSkipping archived package ${packageInfo.name}.`);

    const result = createWorkflowResult({ exitCode: 0 });
    return result;
  }

  const hasPackageSource = checkHasPackageSource({ packageInfo });

  if (hasPackageSource === false) {
    console.log(`\nNo source directory found for ${packageInfo.name}.`);

    const result = createWorkflowResult({ exitCode: 0 });
    return result;
  }

  const exitCode = runCommand({
    args: [`tsc`, `-b`],
    cwd: packageInfo.directory,
  });
  const result = createWorkflowResult({ exitCode });

  return result;
};
