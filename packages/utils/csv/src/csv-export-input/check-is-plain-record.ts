export const checkIsPlainRecord = (
  value: unknown,
): value is Readonly<Record<string, unknown>> => {
  if (value === null || typeof value !== `object` || Array.isArray(value)) {
    return false;
  }

  const prototype: unknown = Object.getPrototypeOf(value);
  const result = prototype === Object.prototype || prototype === null;

  return result;
};
