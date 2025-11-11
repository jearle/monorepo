export const TABLE_NAME_USER_TOKENS = `user_tokens`;

export const TOKEN_TYPE_REFRESH = `refresh`;
export const TOKEN_TYPE_ACCESS = `access`;
export const TOKEN_TYPE_TEMP = `temp`;
export const TOKEN_TYPES = [
  TOKEN_TYPE_ACCESS,
  TOKEN_TYPE_REFRESH,
  TOKEN_TYPE_TEMP,
] as const;
