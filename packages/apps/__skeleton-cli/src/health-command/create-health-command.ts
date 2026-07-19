import { defineCommand } from '@bunli/core';

import { COMMAND_HEALTH, COMMAND_HEALTH_DESCRIPTION } from '../constants';
import { type HealthCommandContext } from './types';

export const createHealthCommand = (ctx: HealthCommandContext) => {
  const { logger } = ctx;
  const healthCommand = defineCommand({
    name: COMMAND_HEALTH,
    description: COMMAND_HEALTH_DESCRIPTION,
    handler: () => {
      const now = new Date();
      const timestamp = now.toISOString();

      logger.debug({ timestamp }, `Health command completed`);
    },
  });

  const result = { healthCommand };

  return result;
};
