export const createError = (error: unknown) => {
  const isError = error instanceof Error;

  if (isError) {
    const result = error;
    return result;
  }

  const result = new Error(String(error));
  return result;
};
