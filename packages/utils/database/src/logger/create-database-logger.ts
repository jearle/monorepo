import { createLogger } from '@jearle/util-logger';

import { type Env } from '../env';

type PropsCreateAuthenticationAPILogger = {
  readonly env: Env;
};
export const createDatabaseLogger = (
  props: PropsCreateAuthenticationAPILogger,
) => {
  const { env } = props;
  const { NODE_ENV: nodeEnv, LOG_LEVEL: level } = env;
  const { logger } = createLogger({
    name: `util-database`,
    nodeEnv,
    level,
  });

  const result = { logger };

  return result;
};
