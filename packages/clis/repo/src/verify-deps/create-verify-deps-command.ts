import { verifyDeps } from '@jearle/lib-repo';

import { createRepoWorkflowCommand } from '../command';
import {
  COMMAND_REPO_VERIFY_DEPS,
  COMMAND_REPO_VERIFY_DEPS_DESCRIPTION,
} from '../constants';

export const createVerifyDepsCommand = () => {
  const { command: verifyDepsCommand } = createRepoWorkflowCommand({
    name: COMMAND_REPO_VERIFY_DEPS,
    description: COMMAND_REPO_VERIFY_DEPS_DESCRIPTION,
    runWorkflow: verifyDeps,
  });

  const result = { verifyDepsCommand };
  return result;
};
