import { z } from 'zod';
import type { ZodObject, ZodRawShape } from 'zod';

type PropsCreateEnv<T extends ZodRawShape> = {
  readonly EnvSchema: ZodObject<T>;
};
export const parseEnv = <T extends ZodRawShape>(props: PropsCreateEnv<T>) => {
  const { EnvSchema } = props;

  const parsedEnv = EnvSchema.safeParse(process.env);

  const { success } = parsedEnv;

  if (success === false) {
    const { error } = parsedEnv;

    const errorTree = z.treeifyError(error);
    console.error('Invalid environment variables:\n', errorTree);
    process.exit(1);
  }

  const { data: env } = parsedEnv;

  const result = { env };

  return result;
};
