import { toSnakeCaseProps } from '@jearle/util-convert';
import { type NewEntity } from './types';

export type EntityToInsertFragmentsProps<TEntity> = {
  readonly entity: TEntity;
};
export const entityToInsertFragments = <TEntity extends NewEntity = NewEntity>(
  props: EntityToInsertFragmentsProps<TEntity>,
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
      column: key,
      placeholder: `$${index + 1}`,
      value: entity[key],
    };

    return fragment;
  });
  const columns = fragments.map((fragment) => {
    const column = fragment.column;

    return column;
  });
  const placeholders = fragments.map((fragment) => {
    const placeholder = fragment.placeholder;

    return placeholder;
  });
  const values = fragments.map((fragment) => {
    const value = fragment.value;

    return value;
  });

  const result = {
    success: true as const,
    columns,
    placeholders,
    values,
  };

  return result;
};
