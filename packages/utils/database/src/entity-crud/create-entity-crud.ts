import { type PostgresDatabase } from '@jearle/lib-postgres';

import { queryCreateOne } from '../query-create-one';
import { queryReadOne } from '../query-read-one';
import { queryUpdateOne } from '../query-update-one';
import { queryDestroyOne } from '../query-destroy-one';
import { queryReadOneBy } from '../query-read-one-by';
import { queryDestroyOneBy } from '../query-destroy-one-by';

type PropsCreateEntityCRUD = {
  readonly db: PostgresDatabase;
  readonly table: string;
};
export const createEntityCRUD = <TEntity>(props: PropsCreateEntityCRUD) => {
  const { db, table } = props;

  type PropsCreate = Partial<TEntity>;
  const create = async (props: PropsCreate) => {
    const queryResult = await queryCreateOne<TEntity>({
      db,
      table,
      entity: props,
    });

    const { success } = queryResult;
    if (success === false) {
      const { error } = queryResult;
      const result = {
        success,
        error,
      };

      return result;
    }

    const { data } = queryResult;

    const result = {
      success: true as const,
      entity: data,
    };

    return result;
  };

  type PropsRead = {
    readonly id: string;
  };
  const read = async (props: PropsRead) => {
    const { id } = props;

    const queryResult = await queryReadOne<TEntity>({ db, table, id });

    const { success } = queryResult;
    if (success === false) {
      const { error } = queryResult;
      const result = {
        success: false as const,
        error: error as Error,
      };

      return result;
    }

    const { data } = queryResult;

    const result = {
      success: true as const,
      entity: data as TEntity,
    };

    return result;
  };

  type PropsReadBy = Partial<TEntity>;
  const readBy = async (props: PropsReadBy) => {
    const queryResult = await queryReadOneBy<TEntity>({
      db,
      table,
      entity: props,
    });

    const { success } = queryResult;
    if (success === false) {
      const { error } = queryResult;
      const result = {
        success: false as const,
        error: error as Error,
      };

      return result;
    }

    const { data } = queryResult;

    const result = {
      success: true as const,
      entity: data as TEntity,
    };

    return result;
  };

  type PropsUpdate = Omit<Partial<TEntity>, `id`> & {
    readonly id: string;
  };
  const update = async (props: PropsUpdate) => {
    const queryResult = await queryUpdateOne<TEntity>({
      db,
      table,
      entity: props,
    });

    const { success } = queryResult;
    if (success === false) {
      const { error } = queryResult;
      const result = {
        success: false as const,
        error,
      };

      return result;
    }

    const { data } = queryResult;

    const result = {
      success: true as const,
      entity: data,
    };

    return result;
  };

  type PropsDestroy = {
    readonly id: string;
  };
  const destroy = async (props: PropsDestroy) => {
    const { id } = props;

    const queryResult = await queryDestroyOne<TEntity>({
      db,
      table,
      id,
    });

    const { success } = queryResult;
    if (success === false) {
      return queryResult;
    }

    const { data: user } = queryResult;

    const result = { success: true as const, user };

    return result;
  };

  type PropsDestroyBy = Partial<TEntity>;
  const destroyBy = async (props: PropsDestroyBy) => {
    const queryResult = await queryDestroyOneBy<TEntity>({
      db,
      table,
      entity: props,
    });

    const { success } = queryResult;
    if (success === false) {
      const { error } = queryResult;
      const result = {
        success: false as const,
        error: error as Error,
      };
      return result;
    }

    const { data } = queryResult;
    const result = {
      success: true as const,
      entity: data as TEntity,
    };

    return result;
  };

  const result = { create, read, readBy, update, destroy, destroyBy };

  return result;
};
