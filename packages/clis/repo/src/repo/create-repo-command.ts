import { defineGroup } from '@bunli/core';

import { createCompileCommand } from '../compile';
import { COMMAND_REPO, COMMAND_REPO_DESCRIPTION } from '../constants';
import { createFormatCommand } from '../format';
import { createHealthCommand } from '../health';
import { createLintCommand } from '../lint';
import { createPackageCommand } from '../package';
import { createSkeletonCommand } from '../skeleton';
import { createTestCommand } from '../test';
import { createVerifyCommand } from '../verify';
import { type RepoCommandContext } from './types';

export const createRepoCommand = (ctx: RepoCommandContext) => {
  const { compileCommand } = createCompileCommand();
  const { formatCommand } = createFormatCommand();
  const { healthCommand } = createHealthCommand(ctx);
  const { lintCommand } = createLintCommand();
  const { packageCommand } = createPackageCommand();
  const { skeletonCommand } = createSkeletonCommand();
  const { testCommand } = createTestCommand();
  const { verifyCommand } = createVerifyCommand();
  const repoCommand = defineGroup({
    name: COMMAND_REPO,
    description: COMMAND_REPO_DESCRIPTION,
    commands: [
      compileCommand,
      formatCommand,
      healthCommand,
      lintCommand,
      packageCommand,
      skeletonCommand,
      testCommand,
      verifyCommand,
    ],
  });

  const result = { repoCommand };
  return result;
};
