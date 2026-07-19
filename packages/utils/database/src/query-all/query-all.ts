import { type PostgresDatabase } from '@jearle/lib-postgres';

import { toCamelCaseProps } from '@jearle/util-convert';

import { type QueryAllResult } from './types';

export type QueryAllProps = {
  readonly db: PostgresDatabase;
  readonly queryString: string;
  readonly values?: unknown[];
  readonly limit: number;
  readonly page: number; // 0-based
};

export const queryAll = async <TData>(
  props: QueryAllProps,
): Promise<QueryAllResult<TData>> => {
  const { db, queryString, values, limit, page } = props;

  const offset = page * limit;

  const baseValues = values ?? [];

  const limitParamIndex = baseValues.length + 1;
  const offsetParamIndex = baseValues.length + 2;

  const queryStringWithPagination = `${queryString} LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}`;

  let rows: readonly Record<string, unknown>[];
  try {
    const queryResult = await db.query<Record<string, unknown>>(
      queryStringWithPagination,
      [...baseValues, limit, offset],
    );

    const { rows: queryRows } = queryResult;

    rows = queryRows;
  } catch (error) {
    const result = { success: false as const, error: new Error(`${error}`) };

    return result;
  }

  const dataResult = rows.reduce<QueryAllResult<TData>>(
    (currentResult, row) => {
      if (currentResult.success === false) {
        return currentResult;
      }

      const transformedRow = toCamelCaseProps<TData>(row);

      if (transformedRow === null) {
        const result = {
          success: false as const,
          error: new Error(`Row camel case transform fail`),
        };

        return result;
      }

      const result = {
        success: true as const,
        data: [...currentResult.data, transformedRow],
      };

      return result;
    },
    {
      success: true as const,
      data: [],
    },
  );

  if (dataResult.success === false) {
    return dataResult;
  }

  const { data } = dataResult;
  const result = { success: true as const, data };

  return result;
};
