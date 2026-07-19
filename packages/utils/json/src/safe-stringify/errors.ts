export const createStringifyError = (errorUnknown: unknown) => {
  if (errorUnknown instanceof Error) {
    return errorUnknown;
  }

  let message: string;

  try {
    message = String(errorUnknown);
  } catch {
    message = `Unknown JSON stringify error`;
  }

  const error = new Error(message);

  return error;
};
