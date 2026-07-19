import { expect, test } from 'bun:test';

import { createLogger } from '../logger';
import { createEnv } from '../env';

import { createPostgresDatabase } from '.';

const { env } = createEnv();
const { logger } = createLogger({ env });

const { DATABASE_URL } = env;

test(`createPostgresDatabase({ connectionString })`, async () => {
  const { db } = await createPostgresDatabase({
    connectionString: DATABASE_URL,
    logger,
  });

  const queryResult = await db.query(`SELECT 1`);
  const { rowCount } = queryResult;

  expect(rowCount).toEqual(1);
});
