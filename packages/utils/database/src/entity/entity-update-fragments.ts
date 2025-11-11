import { toSnakeCaseProps } from '@jearle/util-convert';
import type { ExistingEntity } from './types';

export type PropsEntityToUpdateFragments<TEntity> = {
  readonly entity: TEntity;
};
export const entityToUpdateFragments = <
  TEntity extends ExistingEntity = ExistingEntity,
>(
  props: PropsEntityToUpdateFragments<TEntity>,
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
  const values: unknown[] = [];
  const assignments: string[] = [];

  for (let i = 0; i < entityKeys.length; i++) {
    const key = entityKeys[i]!;

    values.push(entity[key]);
    assignments.push(`${key} = $${i + 1}`);
  }

  const { id, deleted_at } = entity;
  if (deleted_at === true) {
    assignments.push(`deleted_at = NOW()`);
  }

  values.push(id);

  const result = {
    success: true as const,
    values,
    assignments,
  };

  return result;
};
