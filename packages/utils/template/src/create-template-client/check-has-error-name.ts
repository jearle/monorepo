type ErrorWithName = {
  readonly name: unknown;
};

export const checkHasErrorName = (error: unknown, name: string) => {
  if (typeof error !== `object` || error === null || !(`name` in error)) {
    return false;
  }

  const errorWithName: ErrorWithName = error;
  const result = errorWithName.name === name;

  return result;
};
