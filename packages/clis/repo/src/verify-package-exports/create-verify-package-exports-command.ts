import { verifyPackageExports } from '@jearle/lib-repo';

import { createRepoWorkflowCommand } from '../command';
import {
  COMMAND_REPO_VERIFY_PACKAGE_EXPORTS,
  COMMAND_REPO_VERIFY_PACKAGE_EXPORTS_DESCRIPTION,
} from '../constants';

export const createVerifyPackageExportsCommand = () => {
  const { command: verifyPackageExportsCommand } = createRepoWorkflowCommand({
    name: COMMAND_REPO_VERIFY_PACKAGE_EXPORTS,
    description: COMMAND_REPO_VERIFY_PACKAGE_EXPORTS_DESCRIPTION,
    runWorkflow: verifyPackageExports,
  });

  const result = { verifyPackageExportsCommand };
  return result;
};
