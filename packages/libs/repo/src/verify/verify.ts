import {
  executeBufferedShellCommand,
  executeShellCommand,
  executeStreamingShellCommand,
} from '../shell-command';
import { lint } from '../lint';
import { verifyDeps } from '../verify-deps';
import { verifyPackageExports } from '../verify-package-exports';
import { verifyPackageScripts } from '../verify-package-scripts';
import { createWorkflowResult } from '../workflow-result';
import {
  executeWorkspaceScript,
  normalizeFilePaths,
  readWorkspacePackages,
  resolveAffectedPackages,
  resolveWorkspaceRepoRoot,
} from '../workspace';
import { PACKAGE_SCRIPT_COMPILE } from './constants';
import { runFullVerify } from './run-full-verify';
import { runStylelint } from './run-stylelint';

import { type VerifyOptions } from './types';

const checkShouldRunFullWorkflow = (filePaths: readonly string[]) =>
  filePaths.length === 0;
export type VerifyProps = {
  readonly cwd: string;
  readonly filePaths: readonly string[];
};

export const verify = async (
  props: VerifyProps,
  options: VerifyOptions = {},
) => {
  const { cwd, filePaths: rawFilePaths } = props;
  const {
    runBufferedCommand = executeBufferedShellCommand,
    runCommand = executeShellCommand,
    runStreamingCommand = executeStreamingShellCommand,
    verifyPackageExports: verifyPackageExportsWorkflow = verifyPackageExports,
    verifyPackageScripts: verifyPackageScriptsWorkflow = verifyPackageScripts,
  } = options;
  const repoRoot = await resolveWorkspaceRepoRoot({ cwd });

  if (repoRoot === null) {
    const result = createWorkflowResult({ exitCode: 1 });
    return result;
  }

  const shouldRunFullWorkflow = checkShouldRunFullWorkflow(rawFilePaths);

  if (shouldRunFullWorkflow) {
    const exitCode = await runFullVerify({
      repoRoot,
      runners: {
        runBufferedCommand,
        runStreamingCommand,
      },
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
  const lintResult = await lint(
    {
      cwd: repoRoot,
      filePaths,
    },
    { runCommand },
  );
  const lintStatus = lintResult.exitCode;

  if (lintStatus !== 0) {
    const result = createWorkflowResult({ exitCode: lintStatus });
    return result;
  }

  const stylelintStatus = runStylelint({ filePaths, repoRoot }, { runCommand });

  if (stylelintStatus !== 0) {
    const result = createWorkflowResult({ exitCode: stylelintStatus });
    return result;
  }

  const compileStatus = executeWorkspaceScript({
    packageInfos: affectedPackages,
    repoRoot,
    runCommand,
    scriptName: PACKAGE_SCRIPT_COMPILE,
  });

  if (compileStatus !== 0) {
    const result = createWorkflowResult({ exitCode: compileStatus });
    return result;
  }

  const verifyDepsResult = await verifyDeps(
    {
      cwd: repoRoot,
      filePaths,
    },
    { runCommand },
  );

  if (verifyDepsResult.exitCode !== 0) {
    return verifyDepsResult;
  }

  const verifyPackageScriptsResult = await verifyPackageScriptsWorkflow({
    cwd: repoRoot,
    filePaths,
  });

  if (verifyPackageScriptsResult.exitCode !== 0) {
    return verifyPackageScriptsResult;
  }

  const verifyPackageExportsResult = await verifyPackageExportsWorkflow({
    cwd: repoRoot,
    filePaths,
  });

  return verifyPackageExportsResult;
};
