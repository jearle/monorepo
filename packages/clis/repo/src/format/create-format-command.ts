import { format } from '@jearle/lib-repo';

import { createRepoWorkflowCommand } from '../command';
import {
  COMMAND_REPO_FORMAT,
  COMMAND_REPO_FORMAT_DESCRIPTION,
} from '../constants';

export const createFormatCommand = () => {
  const { command: formatCommand } = createRepoWorkflowCommand({
    name: COMMAND_REPO_FORMAT,
    description: COMMAND_REPO_FORMAT_DESCRIPTION,
    runWorkflow: format,
  });

  const result = { formatCommand };
  return result;
};
