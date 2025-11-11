import { createLogger } from '@jearle/util-logger';

import { type Env } from '../env';

type PropsCreatePosgresLogger = {
  readonly env: Env;
};
export const createPostgresLogger = (props: PropsCreatePosgresLogger) => {
  const { env } = props;
  const { NODE_ENV: nodeEnv, LOG_LEVEL: level } = env;
  const { logger } = createLogger({
    name: `lib-postgres`,
    nodeEnv,
    level,
  });

  const result = { logger };

  return result;
};
