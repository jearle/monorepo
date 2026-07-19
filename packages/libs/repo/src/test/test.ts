import { executeShellCommand } from '../shell-command';
import { createWorkflowResult } from '../workflow-result';
import {
  executeWorkspaceScript,
  filterFilesByExtension,
  normalizeFilePaths,
  readWorkspacePackages,
  resolveAffectedPackages,
  resolveWorkspaceRepoRoot,
} from '../workspace';

import { type TestOptions } from './types';

const PACKAGE_SCRIPT_TEST = `test`;

const testInputExtensions = new Set([
  `.cjs`,
  `.cts`,
  `.js`,
  `.jsx`,
  `.mjs`,
  `.mts`,
  `.ts`,
  `.tsx`,
]);

const checkShouldRunFullWorkflow = (filePaths: readonly string[]) =>
  filePaths.length === 0;
export type TestProps = {
  readonly cwd: string;
  readonly filePaths: readonly string[];
};

export const test = async (props: TestProps, options: TestOptions = {}) => {
  const { cwd, filePaths: rawFilePaths } = props;
  const { runCommand = executeShellCommand } = options;
  const repoRoot = await resolveWorkspaceRepoRoot({ cwd });

  if (repoRoot === null) {
    const result = createWorkflowResult({ exitCode: 1 });
    return result;
  }

  const packageInfos = readWorkspacePackages({ repoRoot });
  const shouldRunFullWorkflow = checkShouldRunFullWorkflow(rawFilePaths);
  const filePaths = normalizeFilePaths({
    cwd,
    repoRoot,
    filePaths: rawFilePaths,
  });
  const affectedPackages = resolveAffectedPackages({
    filePaths: filterFilesByExtension({
      filePaths,
      extensions: testInputExtensions,
    }),
    packageInfos,
  });
  const testPackages = shouldRunFullWorkflow ? packageInfos : affectedPackages;
  const exitCode = executeWorkspaceScript({
    packageInfos: testPackages,
    repoRoot,
    runCommand,
    scriptName: PACKAGE_SCRIPT_TEST,
  });
  const result = createWorkflowResult({ exitCode });

  return result;
};
