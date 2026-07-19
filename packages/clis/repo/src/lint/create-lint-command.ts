import { lint } from '@jearle/lib-repo';

import { createRepoWorkflowCommand } from '../command';
import { COMMAND_REPO_LINT, COMMAND_REPO_LINT_DESCRIPTION } from '../constants';

export const createLintCommand = () => {
  const { command: lintCommand } = createRepoWorkflowCommand({
    name: COMMAND_REPO_LINT,
    description: COMMAND_REPO_LINT_DESCRIPTION,
    runWorkflow: lint,
  });

  const result = { lintCommand };
  return result;
};
