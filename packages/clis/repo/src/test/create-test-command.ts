import { test } from '@jearle/lib-repo';

import { createRepoWorkflowCommand } from '../command';
import { COMMAND_REPO_TEST, COMMAND_REPO_TEST_DESCRIPTION } from '../constants';

export const createTestCommand = () => {
  const { command: testCommand } = createRepoWorkflowCommand({
    name: COMMAND_REPO_TEST,
    description: COMMAND_REPO_TEST_DESCRIPTION,
    runWorkflow: test,
  });

  const result = { testCommand };
  return result;
};
