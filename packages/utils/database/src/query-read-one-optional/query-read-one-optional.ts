import { type PostgresDatabase } from '@jearle/lib-postgres';
import { toCamelCaseProps } from '@jearle/util-convert';

import { type QueryReadOneOptionalResult } from './types';

export type QueryReadOneOptionalProps = {
  readonly db: PostgresDatabase;
  readonly table: string;
  readonly id: string;
};

export const queryReadOneOptional = async <TData>(
  props: QueryReadOneOptionalProps,
): Promise<QueryReadOneOptionalResult<TData>> => {
  const { db, table, id } = props;
  let firstRow: Record<string, unknown> | undefined;
  try {
    const { rows } = await db.query<Record<string, unknown>>(
      `SELECT * from ${table} WHERE id = $1`,
      [id],
    );
    firstRow = rows[0];
  } catch (error) {
    const result = { success: false as const, error: new Error(`${error}`) };

    return result;
  }

  if (firstRow === undefined) {
    const result = { success: true as const, data: null };

    return result;
  }

  const data = toCamelCaseProps<TData>(firstRow);

  if (data === null) {
    const result = {
      success: false as const,
      error: new Error(`Row camel case transform fail`),
    };

    return result;
  }

  const result = { success: true as const, data };

  return result;
};
