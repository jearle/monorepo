import { type PostgresDatabase } from '@jearle/lib-postgres';

import { toCamelCaseProps } from '@jearle/util-convert';

export type QueryOneResult<TData> =
  | {
      readonly success: false;
      readonly error: Error;
    }
  | {
      readonly success: true;
      readonly data: TData;
    };

export type PropsQueryOne = {
  readonly db: PostgresDatabase;
  readonly queryString: string;
  readonly values?: unknown[];
};
export const queryOne = async <TData>(
  props: PropsQueryOne,
): Promise<QueryOneResult<TData>> => {
  const { db, queryString, values } = props;
  let firstRow;
  try {
    const { rows } = await db.query(queryString, values);
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

  const result = { success: true as const, data: data as TData };

  return result;
};
