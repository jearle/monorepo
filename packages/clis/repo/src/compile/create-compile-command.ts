import { compile } from '@jearle/lib-repo';

import { createRepoWorkflowCommand } from '../command';
import {
  COMMAND_REPO_COMPILE,
  COMMAND_REPO_COMPILE_DESCRIPTION,
} from '../constants';

export const createCompileCommand = () => {
  const { command: compileCommand } = createRepoWorkflowCommand({
    name: COMMAND_REPO_COMPILE,
    description: COMMAND_REPO_COMPILE_DESCRIPTION,
    runWorkflow: compile,
  });

  const result = { compileCommand };
  return result;
};
