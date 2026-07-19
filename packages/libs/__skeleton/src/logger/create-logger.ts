import { createLogger as createBaseLogger } from '@jearle/util-logger';

import { PACKAGE_NAME } from '../constants';
import { type Env } from '../env';

export type CreateLoggerProps = {
  readonly env: Env;
};

export const createLogger = (props: CreateLoggerProps) => {
  const { env } = props;
  const { LOG_LEVEL: level, NODE_ENV: nodeEnv } = env;
  const { logger } = createBaseLogger({
    name: PACKAGE_NAME,
    level,
    nodeEnv,
  });

  const result = { logger };
  return result;
};
