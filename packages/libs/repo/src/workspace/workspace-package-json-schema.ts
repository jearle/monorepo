import { z } from 'zod';

export const WorkspacePackageJsonSchema = z.looseObject({
  exports: z.unknown().optional(),
  name: z.string(),
  private: z.boolean().optional(),
  scripts: z.record(z.string(), z.string()).optional(),
  version: z.string().optional(),
});
