import { type PostgresDatabase } from '@jearle/lib-postgres';
import { toSnakeCaseProps } from '@jearle/util-convert';
import { queryAll } from '../query-all';

export type OrderByDirection = `asc` | `desc`;

export type OrderBy = {
  readonly column: string;
  readonly direction?: OrderByDirection;
};

const ORDER_BY_COLUMN_REGEX = /^[a-z_][a-z0-9_]*$/;

type WhereParts = {
  readonly values: readonly unknown[];
  readonly whereConditions: readonly string[];
};
type OrderByPartsResultFailure = {
  readonly success: false;
  readonly error: Error;
};

type OrderByPartsResultSuccess = {
  readonly success: true;
  readonly orderByParts: readonly string[];
};

type OrderByPartsResult = OrderByPartsResultSuccess | OrderByPartsResultFailure;
export type QueryAllByProps<TData> = {
  readonly db: PostgresDatabase;
  readonly table: string;
  readonly entity: Partial<TData>;
  readonly limit: number;
  readonly page: number; // 0-based
  readonly orderBy?: readonly OrderBy[];
};

export const queryAllBy = async <TData>(props: QueryAllByProps<TData>) => {
  const { db, table, entity: entityRaw, limit, page, orderBy } = props;

  const entity = toSnakeCaseProps<Record<string, unknown>>(entityRaw);

  if (entity === null) {
    const result = {
      success: false as const,
      error: new Error(`Error snake casing entity for readAllBy`),
    };

    return result;
  }

  const entityEntries = Object.entries(entity).filter((entityEntry) => {
    const [, value] = entityEntry;

    return value !== undefined;
  });

  if (entityEntries.length === 0) {
    const result = {
      success: false as const,
      error: new Error(`No where fields provided for readAllBy`),
    };

    return result;
  }

  const whereParts = entityEntries.reduce<WhereParts>(
    (currentParts, entityEntry) => {
      const [key, value] = entityEntry;

      if (value === null) {
        const result = {
          values: currentParts.values,
          whereConditions: [...currentParts.whereConditions, `${key} IS NULL`],
        };

        return result;
      }

      const values = [...currentParts.values, value];
      const result = {
        values,
        whereConditions: [
          ...currentParts.whereConditions,
          `${key} = $${values.length}`,
        ],
      };

      return result;
    },
    {
      values: [],
      whereConditions: [],
    },
  );
  const { values, whereConditions } = whereParts;

  const whereClause = whereConditions.join(` AND `);

  let orderByClause = ``;

  if (orderBy !== undefined && orderBy.length > 0) {
    const orderByPartsResult = orderBy.reduce<OrderByPartsResult>(
      (currentResult, orderByItem) => {
        if (currentResult.success === false) {
          return currentResult;
        }

        const columnLookup = toSnakeCaseProps<Record<string, boolean>>({
          [orderByItem.column]: true,
        });

        if (columnLookup === null) {
          const result = {
            success: false as const,
            error: new Error(`Error snake casing orderBy column`),
          };

          return result;
        }

        const [column] = Object.keys(columnLookup);

        if (
          column === undefined ||
          ORDER_BY_COLUMN_REGEX.test(column) === false
        ) {
          const result = {
            success: false as const,
            error: new Error(`Invalid orderBy column`),
          };

          return result;
        }

        const directionRaw = orderByItem.direction?.toLowerCase();

        let direction: `ASC` | `DESC` = `ASC`;

        if (directionRaw !== undefined) {
          if (directionRaw === `asc`) {
            direction = `ASC`;
          } else if (directionRaw === `desc`) {
            direction = `DESC`;
          } else {
            const result = {
              success: false as const,
              error: new Error(`Invalid orderBy direction`),
            };

            return result;
          }
        }

        const result = {
          success: true as const,
          orderByParts: [
            ...currentResult.orderByParts,
            `${column} ${direction}`,
          ],
        };

        return result;
      },
      {
        success: true as const,
        orderByParts: [],
      },
    );

    if (orderByPartsResult.success === false) {
      return orderByPartsResult;
    }

    const { orderByParts } = orderByPartsResult;
    orderByClause = ` ORDER BY ${orderByParts.join(`, `)}`;
  }

  const queryString = `SELECT * FROM ${table} WHERE ${whereClause}${orderByClause}`;

  const queryResult = await queryAll<TData>({
    db,
    queryString,
    values: [...values],
    limit,
    page,
  });

  if (!queryResult.success) {
    return queryResult;
  }

  const { data } = queryResult;

  const result = { success: true as const, data };

  return result;
};
