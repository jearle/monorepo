import { expect, test } from 'bun:test';
import { type Logger } from '@jearle/util-logger';

import { type __SkeletonServiceContext, create__skeletonService } from '.';
import { type Env } from '../env';

test(`create__skeletonService({ ctx }) returns the service object`, () => {
  const env = {
    NODE_ENV: `test`,
    LOG_LEVEL: `fatal`,
  } satisfies Env;
  const logger = {
    info: () => undefined,
  } as unknown as Logger;
  const ctx = {
    env,
    logger,
  } satisfies __SkeletonServiceContext;
  const { __skeletonService } = create__skeletonService(ctx);

  expect(__skeletonService).toBeDefined();
});
