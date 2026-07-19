import { createPostgresDatabase } from '@jearle/lib-postgres';

import { createEnv } from '../env';
import { createLogger } from '../logger';

export const createTestDatabase = async () => {
  const { env } = createEnv();
  const { logger } = createLogger({ env });
  const { DATABASE_URL } = env;

  const { db } = await createPostgresDatabase({
    logger,
    connectionString: DATABASE_URL,
  });

  const result = { db };

  return result;
};
