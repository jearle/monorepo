export const createUnsupportedStreamDataError = (data: unknown) => {
  const result = new Error(
    `Only JSON objects and arrays are supported. Got: ${String(data)}`,
  );

  return result;
};
