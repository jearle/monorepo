import { __SKELETON_SERVICE_NAME } from './constants';
import { type __SkeletonServiceContext } from './types';

export const info = (ctx: __SkeletonServiceContext) => {
  const { logger } = ctx;
  const result = {
    serviceName: __SKELETON_SERVICE_NAME,
  };

  logger.info(result);

  return result;
};
