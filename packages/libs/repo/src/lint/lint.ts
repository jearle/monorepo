import { executeShellCommand } from '../shell-command';
import { createWorkflowResult } from '../workflow-result';
import {
  filterExistingFiles,
  filterFilesByExtension,
  normalizeFilePaths,
  resolveWorkspaceRepoRoot,
} from '../workspace';

import { type LintOptions } from './types';

const oxlintExtensions = new Set([
  `.cjs`,
  `.cts`,
  `.js`,
  `.jsx`,
  `.mjs`,
  `.mts`,
  `.ts`,
  `.tsx`,
]);

const oxlintConfigPath = `packages/configs/oxlint/.oxlintrc.json`;

const checkShouldRunFullWorkflow = (filePaths: readonly string[]) =>
  filePaths.length === 0;
export type LintProps = {
  readonly cwd: string;
  readonly filePaths: readonly string[];
};

export const lint = async (props: LintProps, options: LintOptions = {}) => {
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
        `oxlint`,
        `.`,
        `--config`,
        oxlintConfigPath,
        `--no-error-on-unmatched-pattern`,
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
  const existingFilePaths = filterExistingFiles({ repoRoot, filePaths });
  const oxlintFilePaths = filterFilesByExtension({
    filePaths: existingFilePaths,
    extensions: oxlintExtensions,
  });

  if (oxlintFilePaths.length === 0) {
    console.log(`\nNo staged files matched Oxlint inputs.`);

    const result = createWorkflowResult({ exitCode: 0 });
    return result;
  }

  const exitCode = runCommand({
    args: [
      `bunx`,
      `oxlint`,
      ...oxlintFilePaths,
      `--config`,
      oxlintConfigPath,
      `--no-error-on-unmatched-pattern`,
    ],
    cwd: repoRoot,
    label: `oxlint staged files`,
  });
  const result = createWorkflowResult({ exitCode });

  return result;
};
