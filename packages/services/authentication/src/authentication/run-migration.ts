import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createPostgresDatabase } from '@jearle/util-database';

const { DATABASE_URL } = process.env as { readonly [key: string]: string };
const AUTHENTICATION_SCHEMA_PATH = join(import.meta.dir, `authentication.sql`);

const runMigration = async () => {
  const { db } = await createPostgresDatabase({
    connectionString: DATABASE_URL!,
  });

  const authenticationSchema = await readFile(AUTHENTICATION_SCHEMA_PATH, {
    encoding: `utf-8`,
  });
  const client = await db.connect();

  try {
    console.log('Running authentication migration...');

    await client.query(authenticationSchema);

    console.log('Authentication migration completed successfully!');
  } catch (error) {
    console.error('Authentication Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
};

runMigration()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
