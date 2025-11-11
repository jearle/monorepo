import { createPostgresDatabase } from '@jearle/util-database';

const { DATABASE_URL } = process.env as { readonly [key: string]: string };

export const createDatabase = async () => {
  const { db } = await createPostgresDatabase({
    connectionString: DATABASE_URL!,
  });

  const result = { db };

  return result;
};
