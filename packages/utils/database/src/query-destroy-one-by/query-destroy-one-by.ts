import { type PostgresDatabase } from '@jearle/lib-postgres';
import { toSnakeCaseProps } from '@jearle/util-convert';

import { queryOne } from '../query-one';

export type QueryDestroyOneByProps<TData> = {
  readonly db: PostgresDatabase;
  readonly table: string;
  readonly entity: Partial<TData>;
};
export const queryDestroyOneBy = async <TData>(
  props: QueryDestroyOneByProps<TData>,
) => {
  const { db, table, entity: entityRaw } = props;

  const entity = toSnakeCaseProps<Record<string, unknown>>(entityRaw);

  if (entity === null) {
    const result = {
      success: false as const,
      error: new Error(`Error snake casing entity for destroyOneBy`),
    };
    return result;
  }

  const keys = Object.keys(entity).filter((key) => {
    const value = entity[key];
    return value !== undefined;
  });

  if (keys.length === 0) {
    const result = {
      success: false as const,
      error: new Error(`No where fields provided for destroyOneBy`),
    };
    return result;
  }

  const values = keys.map((key) => {
    const value = `${entity[key]}`;
    return value;
  });

  const whereConditions = keys.map((key, index) => `${key} = $${index + 1}`);
  const whereClause = whereConditions.join(` AND `);

  const queryString = `
    DELETE FROM ${table}
    WHERE ${whereClause}
    RETURNING *;
  `;

  const queryResult = await queryOne<TData>({ db, queryString, values });

  if (queryResult.success === false) {
    const result = queryResult;
    return result;
  }

  const { data } = queryResult;

  const result = { success: true as const, data };

  return result;
};
