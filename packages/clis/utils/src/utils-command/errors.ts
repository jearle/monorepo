export const getUtilsCommandErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  return message;
};
