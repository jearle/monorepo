import { executeShellCommand } from '../shell-command';
import { checkIsArchivedPackage } from '../workspace';
import { createWorkflowResult } from '../workflow-result';
import { resolvePackageWorkflowContext } from './resolve-package-workflow-context';
import { type LintPackageOptions, type PackageWorkflowProps } from './types';

const oxlintConfigPath = `packages/configs/oxlint/.oxlintrc.json`;
export type LintPackageProps = PackageWorkflowProps;

export const lintPackage = async (
  props: LintPackageProps,
  options: LintPackageOptions = {},
) => {
  const { cwd } = props;
  const { runCommand = executeShellCommand } = options;
  const context = await resolvePackageWorkflowContext({ cwd });

  if (context === null) {
    const result = createWorkflowResult({ exitCode: 1 });
    return result;
  }

  const { packageInfo, repoRoot } = context;
  const isArchivedPackage = checkIsArchivedPackage(packageInfo);

  if (isArchivedPackage) {
    console.log(`\nSkipping archived package ${packageInfo.name}.`);

    const result = createWorkflowResult({ exitCode: 0 });
    return result;
  }

  const exitCode = runCommand({
    args: [
      `oxlint`,
      packageInfo.relativeDirectory,
      `--config`,
      oxlintConfigPath,
      `--no-error-on-unmatched-pattern`,
    ],
    cwd: repoRoot,
  });
  const result = createWorkflowResult({ exitCode });

  return result;
};
