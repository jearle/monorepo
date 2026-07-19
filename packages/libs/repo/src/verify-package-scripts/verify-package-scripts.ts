import { createWorkflowResult } from '../workflow-result';
import { readWorkspacePackages, resolveWorkspaceRepoRoot } from '../workspace';
import { createPackageScriptViolations } from './create-package-script-violations';
import { printPackageScriptViolations } from './print-package-script-violations';
import { selectPackageInfos } from './select-package-infos';

export type VerifyPackageScriptsProps = {
  readonly cwd: string;
  readonly filePaths: readonly string[];
};

export const verifyPackageScripts = async (
  props: VerifyPackageScriptsProps,
) => {
  const { cwd, filePaths: rawFilePaths } = props;
  const repoRoot = await resolveWorkspaceRepoRoot({ cwd });

  if (repoRoot === null) {
    const result = createWorkflowResult({ exitCode: 1 });
    return result;
  }

  const packageInfos = readWorkspacePackages({ repoRoot });
  const selectedPackageInfos = selectPackageInfos({
    cwd,
    packageInfos,
    rawFilePaths,
    repoRoot,
  });
  const violations = selectedPackageInfos.flatMap(
    createPackageScriptViolations,
  );

  printPackageScriptViolations(violations);

  const exitCode = violations.length === 0 ? 0 : 1;
  const result = createWorkflowResult({ exitCode });

  return result;
};
