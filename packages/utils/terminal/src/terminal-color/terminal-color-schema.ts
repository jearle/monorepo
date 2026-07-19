import { z } from 'zod';

export const TerminalColorEnvironmentSchema = z
  .object({
    FORCE_COLOR: z.string().optional(),
    NO_COLOR: z.string().optional(),
  })
  .catchall(z.string().optional());
