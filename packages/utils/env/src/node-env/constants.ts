export const NODE_ENV_PRODUCTION = `production` as const;
export const NODE_ENV_DEVELOPMENT = `development` as const;
export const NODE_ENV_TEST = `test` as const;

export const NODE_ENVS = [
  NODE_ENV_PRODUCTION,
  NODE_ENV_DEVELOPMENT,
  NODE_ENV_TEST,
] as const;
