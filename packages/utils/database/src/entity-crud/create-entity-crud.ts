import { type ExactPartial } from '@jearle/util-types';
import { type PostgresDatabase } from '@jearle/lib-postgres';

import { queryCreateOne } from '../query-create-one';
import { queryReadOne } from '../query-read-one';
import { queryReadOneOptional } from '../query-read-one-optional';
import { queryUpdateOne } from '../query-update-one';
import { queryDestroyOne } from '../query-destroy-one';
import { queryReadOneBy } from '../query-read-one-by';
import { queryReadOneByOptional } from '../query-read-one-by-optional';
import { queryDestroyOneBy } from '../query-destroy-one-by';
import { queryAll } from '../query-all';
import { type OrderBy, queryAllBy } from '../query-all-by';
import { queryUpdateOneBy } from '../query-update-one-by';

export type CreateEntityCRUDProps = {
  readonly db: PostgresDatabase;
  readonly table: string;
};
export const createEntityCRUD = <TEntity>(props: CreateEntityCRUDProps) => {
  const { db, table } = props;

  type CreateProps = Partial<TEntity>;
  const create = async (props: CreateProps) => {
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

  type ReadProps = {
    readonly id: string;
  };
  const read = async (props: ReadProps) => {
    const { id } = props;

    const queryResult = await queryReadOne<TEntity>({ db, table, id });

    const { success } = queryResult;
    if (success === false) {
      const { error } = queryResult;
      const result = {
        success: false as const,
        error: error,
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

  type ReadOptionalProps = {
    readonly id: string;
  };
  const readOptional = async (props: ReadOptionalProps) => {
    const { id } = props;

    const queryResult = await queryReadOneOptional<TEntity>({ db, table, id });

    const { success } = queryResult;
    if (success === false) {
      const { error } = queryResult;
      const result = {
        success: false as const,
        error: error,
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

  type ReadByProps = Partial<TEntity>;
  const readBy = async (props: ReadByProps) => {
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
        error: error,
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

  type ReadOptionalByProps = Partial<TEntity>;
  const readOptionalBy = async (props: ReadOptionalByProps) => {
    const queryResult = await queryReadOneByOptional<TEntity>({
      db,
      table,
      entity: props,
    });

    const { success } = queryResult;
    if (success === false) {
      const { error } = queryResult;
      const result = {
        success: false as const,
        error: error,
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
  type UpdatePropsShape = {
    readonly id: string;
  };

  type UpdateProps = Omit<ExactPartial<TEntity>, `id`> & UpdatePropsShape;
  const update = async (props: UpdateProps) => {
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

  type DestroyProps = {
    readonly id: string;
  };
  const destroy = async (props: DestroyProps) => {
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

    const { data } = queryResult;

    const result = { success: true as const, entity: data };

    return result;
  };

  type DestroyByProps = Partial<TEntity>;
  const destroyBy = async (props: DestroyByProps) => {
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
        error: error,
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

  type ReadAllProps = {
    readonly limit: number;
    readonly page: number; // 0-based
  };
  const readAll = async (props: ReadAllProps) => {
    const { limit, page } = props;

    const queryString = `SELECT * FROM ${table}`;

    const queryResult = await queryAll<TEntity>({
      db,
      queryString,
      limit,
      page,
    });

    const { success } = queryResult;
    if (success === false) {
      const { error } = queryResult;
      const result = {
        success: false as const,
        error: error,
      };

      return result;
    }

    const { data } = queryResult;

    const result = {
      success: true as const,
      entities: data as TEntity[],
    };

    return result;
  };
  type ReadAllByPropsShape = {
    readonly limit: number;
    readonly page: number; // 0-based
    readonly orderBy?: readonly OrderBy[];
  };

  type ReadAllByProps = Partial<TEntity> & ReadAllByPropsShape;
  const readAllBy = async (props: ReadAllByProps) => {
    const { limit, page, orderBy, ...entityUnsafe } = props;

    const entity = entityUnsafe as Partial<TEntity>;

    const queryResult = await queryAllBy<TEntity>({
      db,
      table,
      entity,
      limit,
      page,
      orderBy,
    });

    const { success } = queryResult;
    if (success === false) {
      const { error } = queryResult;
      const result = {
        success: false as const,
        error: error,
      };

      return result;
    }

    const { data } = queryResult;

    const result = {
      success: true as const,
      entities: data as TEntity[],
    };

    return result;
  };
  type UpdateByPropsShape = {
    readonly where: Partial<TEntity>;
  };

  type UpdateByProps = Partial<TEntity> & UpdateByPropsShape;
  const updateBy = async (props: UpdateByProps) => {
    const { where, ...unsafeEntity } = props;

    const entity = unsafeEntity as TEntity;

    const queryResult = await queryUpdateOneBy<TEntity>({
      db,
      table,
      where,
      entity,
    });

    const { success } = queryResult;
    if (success === false) {
      const { error } = queryResult;
      const result = {
        success: false as const,
        error: error,
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

  const result = {
    create,
    read,
    readOptional,
    readBy,
    readOptionalBy,
    update,
    updateBy,
    destroy,
    destroyBy,
    readAll,
    readAllBy,
  };

  return result;
};
