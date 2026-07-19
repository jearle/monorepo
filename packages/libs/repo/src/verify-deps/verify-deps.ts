import { executeShellCommand } from '../shell-command';
import { createWorkflowResult } from '../workflow-result';
import {
  filterRunnablePackages,
  normalizeFilePaths,
  readWorkspacePackages,
  resolveAffectedPackages,
  resolveWorkspaceRepoRoot,
} from '../workspace';

import { type VerifyDepsOptions } from './types';

const checkShouldRunFullWorkflow = (filePaths: readonly string[]) =>
  filePaths.length === 0;
export type VerifyDepsProps = {
  readonly cwd: string;
  readonly filePaths: readonly string[];
};

export const verifyDeps = async (
  props: VerifyDepsProps,
  options: VerifyDepsOptions = {},
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
      args: [
        `knip`,
        `--include`,
        `binaries,catalog,unlisted,unresolved`,
        `--no-progress`,
        `--no-config-hints`,
      ],
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
  const runnablePackages = filterRunnablePackages(affectedPackages);

  if (runnablePackages.length === 0) {
    console.log(`\nNo staged workspaces matched Knip inputs.`);

    const result = createWorkflowResult({ exitCode: 0 });
    return result;
  }

  const workspaceArgs = runnablePackages.flatMap((packageInfo) => [
    `--workspace`,
    packageInfo.name,
  ]);
  const exitCode = runCommand({
    args: [
      `bunx`,
      `knip`,
      `--include`,
      `binaries,catalog,unlisted,unresolved`,
      `--no-progress`,
      `--no-config-hints`,
      ...workspaceArgs,
    ],
    cwd: repoRoot,
    label: `knip staged workspaces`,
  });
  const result = createWorkflowResult({ exitCode });

  return result;
};
