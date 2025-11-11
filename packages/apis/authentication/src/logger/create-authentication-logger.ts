import { createLogger } from '@jearle/util-logger';

import { type Env } from '../env';

export type PropsCreateAuthenticationLogger = {
  readonly env: Env;
};
export const createAuthenticationLogger = (
  props: PropsCreateAuthenticationLogger,
) => {
  const { env } = props;
  const { NODE_ENV: nodeEnv, LOG_LEVEL: level } = env;
  const { logger } = createLogger({
    name: `api-authentication`,
    nodeEnv,
    level,
  });

  const result = { logger };

  return result;
};
