import { createLogger as createBaseLogger } from '@jearle/util-logger';

import { PACKAGE_NAME } from '../constants';
import { type Env } from '../env';

export type CreateLoggerProps = {
  readonly env: Env;
};

export const createLogger = (props: CreateLoggerProps) => {
  const { env } = props;
  const { NODE_ENV: nodeEnv, LOG_LEVEL: level } = env;
  const { logger } = createBaseLogger({
    name: PACKAGE_NAME,
    nodeEnv,
    level,
  });

  const result = { logger };

  return result;
};
