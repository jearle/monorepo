import { createResultError, createResultSuccess } from '@jearle/util-result';

import { type ArrayValueResult } from './types';

export type GetArrayValueProps<TValue> = {
  readonly values: readonly TValue[];
  readonly index: number;
};

export const getArrayValue = <TValue>(
  props: GetArrayValueProps<TValue>,
): ArrayValueResult<TValue> => {
  const { values, index } = props;
  const value = values[index];

  if (value === undefined) {
    const result = createResultError({
      message: `Expected array value at index ${index}.`,
    });

    return result;
  }

  const result = createResultSuccess({ data: value });

  return result;
};
