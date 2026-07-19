import { type PostgresDatabase } from '@jearle/lib-postgres';
import { toSnakeCaseProps } from '@jearle/util-convert';

import { queryOne } from '../query-one';

export type QueryUpdateOneByProps<TData> = {
  readonly db: PostgresDatabase;
  readonly table: string;
  readonly where: Partial<TData>;
  readonly entity: Partial<TData>;
};
export const queryUpdateOneBy = async <TData>(
  props: QueryUpdateOneByProps<TData>,
) => {
  const { db, table, where: whereRaw, entity: entityRaw } = props;

  const where = toSnakeCaseProps<Record<string, unknown>>(whereRaw);
  if (where === null) {
    const result = {
      success: false as const,
      error: new Error(`Error snake casing where entity for updateOneBy`),
    };
    return result;
  }

  const entity = toSnakeCaseProps<Record<string, unknown>>(entityRaw);
  if (entity === null) {
    const result = {
      success: false as const,
      error: new Error(`Error snake casing update entity for updateOneBy`),
    };
    return result;
  }

  const updateKeys = Object.keys(entity).filter((key) => {
    const value = entity[key];
    return value !== undefined;
  });

  if (updateKeys.length === 0) {
    const result = {
      success: false as const,
      error: new Error(`No update fields provided for updateOneBy`),
    };
    return result;
  }

  const whereKeys = Object.keys(where).filter((key) => {
    const value = where[key];
    return value !== undefined;
  });

  if (whereKeys.length === 0) {
    const result = {
      success: false as const,
      error: new Error(`No where fields provided for updateOneBy`),
    };
    return result;
  }

  const updateValues = updateKeys.map((key) => {
    const value = `${entity[key]}`;
    return value;
  });

  const whereValues = whereKeys.map((key) => {
    const value = `${where[key]}`;
    return value;
  });

  const values = [...updateValues, ...whereValues];

  const assignments = updateKeys.map((key, index) => {
    const assignment = `${key} = $${index + 1}`;
    return assignment;
  });

  const whereConditions = whereKeys.map((key, index) => {
    return `${key} = $${assignments.length + index + 1}`;
  });

  const queryString = `
    UPDATE ${table}
    SET ${assignments.join(`, `)}
    WHERE ${whereConditions.join(` AND `)}
    RETURNING *;
  `;

  const queryOneResult = await queryOne<TData>({ db, queryString, values });

  if (queryOneResult.success === false) {
    const result = queryOneResult;
    return result;
  }

  const { data } = queryOneResult;

  const result = { success: true as const, data };

  return result;
};
