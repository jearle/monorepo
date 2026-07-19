import { defineCommand } from '@bunli/core';

import {
  COMMAND_REPO_HEALTH,
  COMMAND_REPO_HEALTH_DESCRIPTION,
} from '../constants';
import { type RepoCommandContext } from '../repo';

export const createHealthCommand = (ctx: RepoCommandContext) => {
  const { logger } = ctx;
  const healthCommand = defineCommand({
    name: COMMAND_REPO_HEALTH,
    description: COMMAND_REPO_HEALTH_DESCRIPTION,
    handler: () => {
      const now = new Date();
      const timestamp = now.toISOString();

      logger.debug({ timestamp }, `Health command completed`);
    },
  });

  const result = { healthCommand };
  return result;
};
