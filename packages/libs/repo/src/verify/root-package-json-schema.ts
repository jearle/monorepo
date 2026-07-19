import { z } from 'zod';

export const RootPackageJsonSchema = z.looseObject({
  scripts: z.record(z.string(), z.string()),
});
