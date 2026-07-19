import { defineGroup } from '@bunli/core';

import {
  COMMAND___SKELETON,
  COMMAND___SKELETON_DESCRIPTION,
} from '../constants';
import { create__skeletonHealthCommand } from './create-__skeleton-health-command';
import { type __skeletonCommandContext } from './types';

export const create__skeletonCommand = (ctx: __skeletonCommandContext) => {
  const { __skeletonHealthCommand } = create__skeletonHealthCommand(ctx);
  const __skeletonCommand = defineGroup({
    name: COMMAND___SKELETON,
    description: COMMAND___SKELETON_DESCRIPTION,
    commands: [__skeletonHealthCommand],
  });

  const result = { __skeletonCommand };
  return result;
};
