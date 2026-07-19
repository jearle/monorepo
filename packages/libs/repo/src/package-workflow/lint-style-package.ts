import { executeShellCommand } from '../shell-command';
import { checkIsArchivedPackage } from '../workspace';
import { createWorkflowResult } from '../workflow-result';
import { checkHasPackageStyleFile } from './check-has-package-style-file';
import { resolvePackageWorkflowContext } from './resolve-package-workflow-context';
import {
  type LintStylePackageOptions,
  type PackageWorkflowProps,
} from './types';

export type LintStylePackageProps = PackageWorkflowProps;
export const lintStylePackage = async (
  props: LintStylePackageProps,
  options: LintStylePackageOptions = {},
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

  const hasPackageStyleFile = checkHasPackageStyleFile({ packageInfo });

  if (hasPackageStyleFile === false) {
    console.log(`\nNo style files found for ${packageInfo.name}.`);

    const result = createWorkflowResult({ exitCode: 0 });
    return result;
  }

  const exitCode = runCommand({
    args: [`stylelint`, `src/**/*.css`, `src/**/*.scss`, `--allow-empty-input`],
    cwd: packageInfo.directory,
  });
  const result = createWorkflowResult({ exitCode });

  return result;
};
