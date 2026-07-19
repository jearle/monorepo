import { createLogger } from '@jearle/util-logger';

import { type Env } from '../env';

export type CreateHealthLoggerProps = {
  readonly env: Env;
};
export const createHealthLogger = (props: CreateHealthLoggerProps) => {
  const { env } = props;
  const { NODE_ENV: nodeEnv, LOG_LEVEL: level } = env;
  const { logger } = createLogger({
    name: `api-health`,
    nodeEnv,
    level,
  });

  const result = { logger };

  return result;
};
