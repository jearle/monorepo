import { executeShellCommand } from '../shell-command';
import { createWorkflowResult } from '../workflow-result';
import {
  executeWorkspaceScript,
  normalizeFilePaths,
  readWorkspacePackages,
  resolveAffectedPackages,
  resolveWorkspaceRepoRoot,
} from '../workspace';

import { type CompileOptions } from './types';

const PACKAGE_SCRIPT_COMPILE = `compile`;

const checkShouldRunFullWorkflow = (filePaths: readonly string[]) =>
  filePaths.length === 0;
export type CompileProps = {
  readonly cwd: string;
  readonly filePaths: readonly string[];
};

export const compile = async (
  props: CompileProps,
  options: CompileOptions = {},
) => {
  const { cwd, filePaths: rawFilePaths } = props;
  const { runCommand = executeShellCommand } = options;
  const repoRoot = await resolveWorkspaceRepoRoot({ cwd });

  if (repoRoot === null) {
    const result = createWorkflowResult({ exitCode: 1 });
    return result;
  }

  const shouldRunFullWorkflow = checkShouldRunFullWorkflow(rawFilePaths);

  if (shouldRunFullWorkflow) {
    const exitCode = runCommand({
      args: [`turbo`, `run`, PACKAGE_SCRIPT_COMPILE],
      cwd: repoRoot,
    });
    const result = createWorkflowResult({ exitCode });

    return result;
  }

  const filePaths = normalizeFilePaths({
    cwd,
    repoRoot,
    filePaths: rawFilePaths,
  });
  const packageInfos = readWorkspacePackages({ repoRoot });
  const affectedPackages = resolveAffectedPackages({
    filePaths,
    packageInfos,
  });
  const exitCode = executeWorkspaceScript({
    packageInfos: affectedPackages,
    repoRoot,
    runCommand,
    scriptName: PACKAGE_SCRIPT_COMPILE,
  });
  const result = createWorkflowResult({ exitCode });

  return result;
};
