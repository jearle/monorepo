import { toSnakeCaseProps } from '@jearle/util-convert';
import type { NewEntity } from './types';

export type PropsEntityToInsertFragments<TEntity> = {
  readonly entity: TEntity;
};
export const entityToInsertFragments = <TEntity extends NewEntity = NewEntity>(
  props: PropsEntityToInsertFragments<TEntity>,
) => {
  const { entity: entityCamelCased } = props;

  const entity = toSnakeCaseProps<Record<string, unknown>>(entityCamelCased);

  if (entity === null) {
    return {
      success: false as const,
      error: new Error('Error snake casing entity'),
    };
  }

  const entityKeys = Object.keys(entity).filter((key) => {
    const isValidKey = key !== `id` && key !== `deleted_at`;

    return isValidKey;
  });
  const columns: string[] = [];
  const placeholders: string[] = [];
  const values: unknown[] = [];

  for (let i = 0; i < entityKeys.length; i++) {
    const key = entityKeys[i]!;
    const value = entity[key];

    columns.push(key);
    values.push(value);
    placeholders.push(`$${i + 1}`);
  }

  const result = {
    success: true as const,
    columns,
    placeholders,
    values,
  };

  return result;
};
