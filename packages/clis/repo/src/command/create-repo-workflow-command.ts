import { defineCommand } from '@bunli/core';
import { setCLIFailureExitCode } from '@jearle/util-cli';

import { type RepoWorkflowResult, type RunRepoWorkflowProps } from './types';

export type CreateRepoWorkflowCommandProps = {
  readonly description: string;
  readonly name: string;
  readonly runWorkflow: (
    props: RunRepoWorkflowProps,
  ) => Promise<RepoWorkflowResult> | RepoWorkflowResult;
};

export const createRepoWorkflowCommand = (
  props: CreateRepoWorkflowCommandProps,
) => {
  const { description, name, runWorkflow } = props;
  const command = defineCommand({
    name,
    description,
    handler: async (commandProps) => {
      const { cwd, positional } = commandProps;
      const workflowResult = await runWorkflow({
        cwd,
        filePaths: positional,
      });

      if (workflowResult.exitCode !== 0) {
        setCLIFailureExitCode();
      }
    },
  });

  const result = { command };
  return result;
};
