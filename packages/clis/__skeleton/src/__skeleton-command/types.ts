import { type Logger } from '@jearle/util-logger';

import { type Env } from '../env';
import { type Services } from '../services';

export type __skeletonCommandContext = {
  readonly env: Env;
  readonly logger: Logger;
  readonly services: Services;
};
