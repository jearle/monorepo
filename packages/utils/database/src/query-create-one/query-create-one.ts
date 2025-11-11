import { type PostgresDatabase } from '@jearle/lib-postgres';

import { type NewEntity, entityToInsertFragments } from '../entity';
import { queryOne } from '../query-one';

export type PropsQueryCreateOne<TEntity extends NewEntity> = {
  readonly db: PostgresDatabase;
  readonly table: string;
  readonly entity: TEntity;
};
export const queryCreateOne = async <
  TData,
  TEntity extends NewEntity = NewEntity,
>(
  props: PropsQueryCreateOne<TEntity>,
) => {
  const { db, table, entity } = props;

  const assignmentsAndValues = entityToInsertFragments({ entity });

  const { success } = assignmentsAndValues;
  if (success === false) {
    return assignmentsAndValues;
  }

  const { columns, placeholders, values } = assignmentsAndValues;

  const queryString = `
    INSERT INTO ${table}
    (${columns.join(', ')})
    VALUES (${placeholders.join(', ')})
    RETURNING *;
  `;

  const queryResult = await queryOne<TData>({ db, queryString, values });

  if (!queryResult.success) {
    return queryResult;
  }

  const { data } = queryResult;

  const result = { success: true as const, data };

  return result;
};
