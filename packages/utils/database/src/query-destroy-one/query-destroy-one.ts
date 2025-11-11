import { type PostgresDatabase } from '@jearle/lib-postgres';
import { queryOne } from '../query-one';

export type PropsQueryDestroyOne = {
  readonly db: PostgresDatabase;
  readonly table: string;
  readonly id: string;
};
export const queryDestroyOne = async <TData>(props: PropsQueryDestroyOne) => {
  const { db, table, id } = props;

  const queryString = `DELETE FROM ${table} WHERE id = $1 RETURNING *`;
  const values = [id];
  const queryResult = await queryOne<TData>({ db, queryString, values });

  return queryResult;
};
