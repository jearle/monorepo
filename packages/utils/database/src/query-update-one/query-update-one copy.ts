import { type PostgresDatabase } from '@jearle/lib-postgres';

import { type ExistingEntity, entityToUpdateFragments } from '../entity';
import { queryOne } from '../query-one';

export type PropsQueryUpdateOne<TEntity extends ExistingEntity> = {
  readonly db: PostgresDatabase;
  readonly table: string;
  readonly entity: TEntity;
};
export const queryUpdateOne = async <
  TData,
  TEntity extends ExistingEntity = ExistingEntity,
>(
  props: PropsQueryUpdateOne<TEntity>,
) => {
  const { db, table, entity } = props;

  const assignmentsAndValues = entityToUpdateFragments({ entity });

  const { success } = assignmentsAndValues;
  if (success === false) {
    return assignmentsAndValues;
  }

  const { values, assignments } = assignmentsAndValues;

  const queryString = `
    UPDATE ${table}
    SET ${assignments.join(', ')}
    WHERE id = $${values.length}
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
