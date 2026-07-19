import { type Logger } from '@jearle/util-logger';

import { type Env } from '../env';

export type __SkeletonServiceContext = {
  readonly env: Env;
  readonly logger: Logger;
};
