import { type PostgresDatabase } from '@jearle/lib-postgres';
import { queryOne } from '../query-one';

export type PropsQueryDestroyOneBy<TData> = {
  readonly db: PostgresDatabase;
  readonly table: string;
  readonly entity: Partial<TData>;
};

export const queryDestroyOneBy = async <TData>(
  props: PropsQueryDestroyOneBy<TData>,
) => {
  const { db, table } = props;
  const entity = props.entity as unknown as { readonly [key: string]: unknown };
  const keys = Object.keys(entity);
  const values = keys.map((key) => {
    const value = `${entity[key]}`;
    return value;
  });
  const whereConditions = keys.map((key, index) => `${key} = $${index + 1}`);
  const whereClause = whereConditions.join(' AND ');
  const queryString = `DELETE FROM ${table} WHERE ${whereClause} RETURNING *`;

  const queryResult = await queryOne<TData>({ db, queryString, values });

  if (!queryResult.success) {
    return queryResult;
  }

  const { data } = queryResult;
  const result = { success: true as const, data };

  return result;
};
