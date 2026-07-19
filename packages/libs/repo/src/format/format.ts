import { executeShellCommand } from '../shell-command';
import { createWorkflowResult } from '../workflow-result';
import { normalizeFilePaths, resolveWorkspaceRepoRoot } from '../workspace';

import { type FormatOptions } from './types';

const checkShouldRunFullWorkflow = (filePaths: readonly string[]) =>
  filePaths.length === 0;
export type FormatProps = {
  readonly cwd: string;
  readonly filePaths: readonly string[];
};

export const format = async (
  props: FormatProps,
  options: FormatOptions = {},
) => {
  const { cwd, filePaths: rawFilePaths } = props;
  const { runCommand = executeShellCommand } = options;
  const repoRoot = await resolveWorkspaceRepoRoot({ cwd });

  if (repoRoot === null) {
    const result = createWorkflowResult({ exitCode: 1 });
    return result;
  }

  const shouldRunFullWorkflow = checkShouldRunFullWorkflow(rawFilePaths);
  const filePaths = normalizeFilePaths({
    cwd,
    repoRoot,
    filePaths: rawFilePaths,
  });
  const prettierInputs = shouldRunFullWorkflow ? [`.`] : filePaths;

  if (prettierInputs.length === 0) {
    console.log(`\nNo files inside the repository matched Prettier inputs.`);

    const result = createWorkflowResult({ exitCode: 0 });
    return result;
  }

  const exitCode = runCommand({
    args: [`prettier`, `--write`, `--ignore-unknown`, ...prettierInputs],
    cwd: repoRoot,
  });
  const result = createWorkflowResult({ exitCode });

  return result;
};
