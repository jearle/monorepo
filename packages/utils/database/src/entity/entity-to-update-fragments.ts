import { toSnakeCaseProps } from '@jearle/util-convert';
import { type ExistingEntity } from './types';

export type EntityToUpdateFragmentsProps<TEntity> = {
  readonly entity: TEntity;
};
export const entityToUpdateFragments = <
  TEntity extends ExistingEntity = ExistingEntity,
>(
  props: EntityToUpdateFragmentsProps<TEntity>,
) => {
  const { entity: entityCamelCased } = props;

  const entity = toSnakeCaseProps<Record<string, unknown>>(entityCamelCased);

  if (entity === null) {
    const result = {
      success: false as const,
      error: new Error(`Error snake casing entity`),
    };

    return result;
  }

  const entityKeys = Object.keys(entity).filter((key) => {
    const isValidKey = key !== `id` && key !== `deleted_at`;

    return isValidKey;
  });
  const fragments = entityKeys.map((key, index) => {
    const fragment = {
      assignment: `${key} = $${index + 1}`,
      value: entity[key],
    };

    return fragment;
  });

  const { id, deleted_at } = entity;
  const entityAssignments = fragments.map((fragment) => {
    const assignment = fragment.assignment;

    return assignment;
  });
  const deleteAssignments = deleted_at === true ? [`deleted_at = NOW()`] : [];
  const assignments = [...entityAssignments, ...deleteAssignments];
  const entityValues = fragments.map((fragment) => {
    const value = fragment.value;

    return value;
  });
  const values = [...entityValues, id];

  const result = {
    success: true as const,
    values,
    assignments,
  };

  return result;
};
