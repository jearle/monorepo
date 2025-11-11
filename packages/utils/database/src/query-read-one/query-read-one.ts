import { type PostgresDatabase } from '@jearle/lib-postgres';
import { queryOne } from '../query-one';

export type PropsQueryReadOne = {
  readonly db: PostgresDatabase;
  readonly table: string;
  readonly id: string;
};
export const queryReadOne = async <TData>(props: PropsQueryReadOne) => {
  const { db, table, id } = props;

  const queryString = `SELECT * from ${table} WHERE id = $1`;
  const values = [id];
  const queryResult = await queryOne<TData>({ db, queryString, values });

  if (!queryResult.success) {
    return queryResult;
  }

  const { data } = queryResult;

  const result = { success: true as const, data };

  return result;
};
