import { type PostgresDatabase } from '@jearle/lib-postgres';
import { toSnakeCaseProps } from '@jearle/util-convert';
import { queryOne } from '../query-one';

export type QueryReadOneByProps<TData> = {
  readonly db: PostgresDatabase;
  readonly table: string;
  readonly entity: Partial<TData>;
};

export const queryReadOneBy = async <TData>(
  props: QueryReadOneByProps<TData>,
) => {
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

  const queryResult = await queryOne<TData>({ db, queryString, values });

  if (!queryResult.success) {
    return queryResult;
  }

  const { data } = queryResult;
  const result = { success: true as const, data };
  return result;
};
