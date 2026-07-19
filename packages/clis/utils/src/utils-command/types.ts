import { type Logger } from '@jearle/util-logger';

import { type Env } from '../env';
import { type Services } from '../services';

export type UtilsCommandContext = {
  readonly env: Env;
  readonly logger: Logger;
  readonly services: Services;
};
