import { createPostgresDatabase } from '@jearle/lib-postgres';
import { type Logger } from '@jearle/util-logger';
import {
  createAuthentication,
  createUsers,
  createUserTokens,
} from '@jearle/service-authentication';

import { type Env } from '../env';

type PropsCreateServices = {
  readonly env: Env;
  readonly logger: Logger;
};
export const createServices = async (props: PropsCreateServices) => {
  const { env, logger } = props;
  const { DATABASE_URL, JWT_SECRET } = env;
  const { db } = await createPostgresDatabase({
    connectionString: DATABASE_URL,
    logger,
  });
  const { users } = createUsers({ db });
  const { userTokens } = createUserTokens({ db });

  const { authentication } = createAuthentication({
    users,
    userTokens,
    jwtSecret: JWT_SECRET,
  });

  const services = {
    authentication,
  };

  const result = { services };

  return result;
};

export type Services = Awaited<ReturnType<typeof createServices>>[`services`];
