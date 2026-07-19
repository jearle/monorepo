import { verify } from '@jearle/lib-repo';

import {
  createRepoWorkflowCommand,
  createRunnableCommandWithChildren,
} from '../command';
import {
  COMMAND_REPO_VERIFY,
  COMMAND_REPO_VERIFY_DESCRIPTION,
} from '../constants';
import { createVerifyDepsCommand } from '../verify-deps';
import { createVerifyPackageExportsCommand } from '../verify-package-exports';
import { createVerifyPackageScriptsCommand } from '../verify-package-scripts';

export const createVerifyCommand = () => {
  const { verifyDepsCommand } = createVerifyDepsCommand();
  const { verifyPackageExportsCommand } = createVerifyPackageExportsCommand();
  const { verifyPackageScriptsCommand } = createVerifyPackageScriptsCommand();
  const { command: verifyRunnableCommand } = createRepoWorkflowCommand({
    name: COMMAND_REPO_VERIFY,
    description: COMMAND_REPO_VERIFY_DESCRIPTION,
    runWorkflow: verify,
  });
  const verifyCommand = createRunnableCommandWithChildren({
    command: verifyRunnableCommand,
    commands: [
      verifyDepsCommand,
      verifyPackageExportsCommand,
      verifyPackageScriptsCommand,
    ],
  });

  const result = { verifyCommand };
  return result;
};
