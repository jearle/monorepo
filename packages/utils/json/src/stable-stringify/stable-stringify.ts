import {
  type JSONStringifyResult,
  type JSONStringifyResultFailure,
  safeStringify,
} from '../safe-stringify';
import { safeParse } from '../safe-parse';

const checkIsPlainObject = (
  value: unknown,
): value is Record<string, unknown> => {
  if (value === null || typeof value !== `object`) {
    return false;
  }

  const prototype: unknown = Object.getPrototypeOf(value);
  const result = prototype === Object.prototype || prototype === null;

  return result;
};

const createStableStringifyFailure = (error: Error) => {
  const result: JSONStringifyResultFailure = {
    error,
    success: false,
  };

  return result;
};

type NormalizeStableJSONValueProps = {
  readonly value: unknown;
};

const normalizeStableJSONValue = (
  props: NormalizeStableJSONValueProps,
): unknown => {
  const { value } = props;

  if (Array.isArray(value)) {
    const normalizedItems = value.map((item) =>
      normalizeStableJSONValue({ value: item }),
    );

    return normalizedItems;
  }

  if (checkIsPlainObject(value) === false) {
    return value;
  }

  const sortedEntries = Object.keys(value)
    .toSorted()
    .map((key) => {
      const normalizedValue = normalizeStableJSONValue({
        value: value[key],
      });
      const entry = [key, normalizedValue] as const;

      return entry;
    });
  const normalizedValue = Object.fromEntries(sortedEntries);

  return normalizedValue;
};

/**
 * Stringifies with JSON.stringify semantics, then recursively sorts object
 * keys in the JSON payload before writing the final string.
 */
export const stableStringify = (
  value: unknown,
  space?: string,
): JSONStringifyResult => {
  const stringifyResult = safeStringify(value);

  if (stringifyResult.success === false) {
    return stringifyResult;
  }

  const parseResult = safeParse(stringifyResult.data);

  if (parseResult.success === false) {
    const result = createStableStringifyFailure(parseResult.error);
    return result;
  }

  const normalizedValue = normalizeStableJSONValue({
    value: parseResult.data,
  });
  const result = safeStringify(normalizedValue, space);

  return result;
};
