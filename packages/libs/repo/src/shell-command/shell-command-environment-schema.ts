import { z } from 'zod';

export const ShellCommandEnvironmentSchema = z
  .object({
    CLICOLOR_FORCE: z.string().optional(),
    FORCE_COLOR: z.string().optional(),
    NO_COLOR: z.string().optional(),
  })
  .catchall(z.string().optional());

export type ShellCommandEnvironment = z.infer<
  typeof ShellCommandEnvironmentSchema
>;
