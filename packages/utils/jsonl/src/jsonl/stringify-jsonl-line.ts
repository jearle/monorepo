import { type JSONStringifyResult, stableStringify } from '@jearle/util-json';

export type StringifyJsonlLineProps = {
  readonly value: unknown;
};

export const stringifyJsonlLine = (
  props: StringifyJsonlLineProps,
): JSONStringifyResult => {
  const { value } = props;
  const result = stableStringify(value);

  return result;
};
