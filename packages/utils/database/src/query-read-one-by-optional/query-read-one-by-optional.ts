import { type PostgresDatabase } from '@jearle/lib-postgres';
import { toCamelCaseProps, toSnakeCaseProps } from '@jearle/util-convert';

import { type QueryReadOneByOptionalResult } from './types';

export type QueryReadOneByOptionalProps<TData> = {
  readonly db: PostgresDatabase;
  readonly table: string;
  readonly entity: Partial<TData>;
};

export const queryReadOneByOptional = async <TData>(
  props: QueryReadOneByOptionalProps<TData>,
): Promise<QueryReadOneByOptionalResult<TData>> => {
  const { db, table, entity: rawEntity } = props;

  const rawEntityEntries = Object.entries(rawEntity).filter((currentEntry) => {
    const [, value] = currentEntry;

    return value !== undefined;
  });
  const cleanedRawEntity = Object.fromEntries(rawEntityEntries);

  const entity = toSnakeCaseProps<Record<string, unknown>>(cleanedRawEntity);

  if (entity === null) {
    const result = {
      success: false as const,
      error: new Error(`Error snake casing entity for readBy`),
    };

    return result;
  }

  const keys = Object.keys(entity);
  const values = keys.map((key) => {
    const value = `${entity[key]}`;
    return value;
  });

  const whereConditions = keys.map((key, index) => `${key} = $${index + 1}`);
  const whereClause = whereConditions.join(` AND `);

  const queryString = `SELECT * FROM ${table} WHERE ${whereClause}`;

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
