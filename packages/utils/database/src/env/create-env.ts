import { parseEnv } from '@jearle/util-env';
import { EnvSchema } from './env-schema';

export const createEnv = () => {
  const { env } = parseEnv({ EnvSchema });

  const result = { env };

  return result;
};
