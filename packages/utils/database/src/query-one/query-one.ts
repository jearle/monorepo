import { type PostgresDatabase } from '@jearle/lib-postgres';

import { toCamelCaseProps } from '@jearle/util-convert';

import { type QueryOneResult } from './types';

export type QueryOneProps = {
  readonly db: PostgresDatabase;
  readonly queryString: string;
  readonly values?: unknown[];
};
export const queryOne = async <TData>(
  props: QueryOneProps,
): Promise<QueryOneResult<TData>> => {
  const { db, queryString, values } = props;
  let firstRow: Record<string, unknown> | undefined;
  try {
    const { rows } = await db.query<Record<string, unknown>>(
      queryString,
      values,
    );
    firstRow = rows[0];
  } catch (error) {
    const result = { success: false as const, error: new Error(`${error}`) };

    return result;
  }

  if (firstRow === undefined) {
    const result = {
      success: false as const,
      error: new Error(`No rows returned`),
    };

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
