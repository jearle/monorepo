import { defineCommand } from '@bunli/core';

import {
  COMMAND___SKELETON_HEALTH,
  COMMAND___SKELETON_HEALTH_DESCRIPTION,
} from '../constants';
import { type __skeletonCommandContext } from './types';

export const create__skeletonHealthCommand = (
  ctx: __skeletonCommandContext,
) => {
  const { logger } = ctx;
  const __skeletonHealthCommand = defineCommand({
    name: COMMAND___SKELETON_HEALTH,
    description: COMMAND___SKELETON_HEALTH_DESCRIPTION,
    handler: () => {
      const now = new Date();
      const timestamp = now.toISOString();

      logger.debug({ timestamp }, `Health command completed`);
    },
  });

  const result = { __skeletonHealthCommand };
  return result;
};
