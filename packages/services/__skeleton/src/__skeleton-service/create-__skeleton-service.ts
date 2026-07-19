import { info } from './info';
import { type __SkeletonServiceContext } from './types';

export const create__skeletonService = (ctx: __SkeletonServiceContext) => {
  const __skeletonService = {
    info: () => info(ctx),
  };
  const result = { __skeletonService };

  return result;
};

export type __SkeletonService = ReturnType<
  typeof create__skeletonService
>[`__skeletonService`];
