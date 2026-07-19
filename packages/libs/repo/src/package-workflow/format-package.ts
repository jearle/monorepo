import { executeShellCommand } from '../shell-command';
import { createWorkflowResult } from '../workflow-result';
import { resolvePackageWorkflowContext } from './resolve-package-workflow-context';
import { type FormatPackageOptions, type PackageWorkflowProps } from './types';

export type FormatPackageProps = PackageWorkflowProps;
export const formatPackage = async (
  props: FormatPackageProps,
  options: FormatPackageOptions = {},
) => {
  const { cwd } = props;
  const { runCommand = executeShellCommand } = options;
  const context = await resolvePackageWorkflowContext({ cwd });

  if (context === null) {
    const result = createWorkflowResult({ exitCode: 1 });
    return result;
  }

  const { packageInfo } = context;
  const exitCode = runCommand({
    args: [`prettier`, `--write`, `--ignore-unknown`, `.`],
    cwd: packageInfo.directory,
  });
  const result = createWorkflowResult({ exitCode });

  return result;
};
