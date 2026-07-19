import { verifyPackageScripts } from '@jearle/lib-repo';

import { createRepoWorkflowCommand } from '../command';
import {
  COMMAND_REPO_VERIFY_PACKAGE_SCRIPTS,
  COMMAND_REPO_VERIFY_PACKAGE_SCRIPTS_DESCRIPTION,
} from '../constants';

export const createVerifyPackageScriptsCommand = () => {
  const { command: verifyPackageScriptsCommand } = createRepoWorkflowCommand({
    name: COMMAND_REPO_VERIFY_PACKAGE_SCRIPTS,
    description: COMMAND_REPO_VERIFY_PACKAGE_SCRIPTS_DESCRIPTION,
    runWorkflow: verifyPackageScripts,
  });

  const result = { verifyPackageScriptsCommand };
  return result;
};
