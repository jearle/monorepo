import { executeShellCommand } from '../shell-command';
import { filterExistingFiles, filterFilesByExtension } from '../workspace';
import { STYLELINT_EXTENSIONS } from './constants';
import { type RunStylelintOptions } from './types';

export type RunStylelintProps = {
  readonly filePaths: readonly string[];
  readonly repoRoot: string;
};

export const runStylelint = (
  props: RunStylelintProps,
  options: RunStylelintOptions = {},
) => {
  const { filePaths, repoRoot } = props;
  const { runCommand = executeShellCommand } = options;
  const existingFilePaths = filterExistingFiles({ repoRoot, filePaths });
  const stylelintFilePaths = filterFilesByExtension({
    filePaths: existingFilePaths,
    extensions: STYLELINT_EXTENSIONS,
  });

  if (stylelintFilePaths.length === 0) {
    console.log(`\nNo staged files matched Stylelint inputs.`);
    return 0;
  }

  const status = runCommand({
    args: [`bunx`, `stylelint`, ...stylelintFilePaths, `--allow-empty-input`],
    cwd: repoRoot,
    label: `stylelint staged files`,
  });

  return status;
};
