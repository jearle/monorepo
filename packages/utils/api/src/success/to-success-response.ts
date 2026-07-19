export const toSuccessResponse = <T>(dataPayload: T) => {
  const data = { success: true as const, ...dataPayload };
  const result = {
    clientErrors: [],
    systemErrors: [],
    data,
  };

  return result;
};
