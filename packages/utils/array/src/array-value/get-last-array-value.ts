import { type ArrayValueResult } from './types';
import { getArrayValue } from './get-array-value';

export type GetLastArrayValueProps<TValue> = {
  readonly values: readonly TValue[];
};

export const getLastArrayValue = <TValue>(
  props: GetLastArrayValueProps<TValue>,
): ArrayValueResult<TValue> => {
  const { values } = props;
  const index = values.length - 1;
  const result = getArrayValue({ values, index });

  return result;
};
