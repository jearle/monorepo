import process from 'node:process';

import { Pool } from 'pg';

import { type Logger } from '@jearle/util-logger';
import { onTerminate } from '@jearle/util-process';

type PropsGracefulShutdown = {
  readonly db: Pool;
  readonly logger: Logger;
};
const shutdownDatabase = async (props: PropsGracefulShutdown) => {
  const { db, logger } = props;

  logger.info(`closing DB pool...`);
  try {
    await db.end();
    logger.info(`DB pool closed successfully.`);

    const result = {
      success: true as const,
    };

    return result;
  } catch (error) {
    logger.error({ error }, `Error closing DB pool: ${error}`);
    const result = {
      success: false as const,
    };

    return result;
  }
};

type PropsDatabaseCheck = {
  readonly db: Pool;
  readonly logger: Logger;
};
const databaseCheck = async (props: PropsDatabaseCheck) => {
  const { db, logger } = props;

  try {
    const client = await db.connect();
    client.release();
    logger.info(`Database connection verified.`);
  } catch (error) {
    logger.error({ error }, `Failed to connect to DB: ${error}`);
    process.exit(1);
  }
};

export type PropsCreateDatabase = {
  readonly connectionString: string;
  readonly logger: Logger;
};
export const createPostgresDatabase = async (props: PropsCreateDatabase) => {
  const { connectionString, logger } = props;

  const db = new Pool({ connectionString });

  await databaseCheck({ db, logger });

  onTerminate(async (props) => {
    const { signal } = props;
    logger.info({ signal }, `Database shutdown triggered by ${signal}`);

    const { success } = await shutdownDatabase({ db, logger });

    const result = { success };

    return result;
  });

  const result = { db, shutdownDatabase };

  return result;
};
