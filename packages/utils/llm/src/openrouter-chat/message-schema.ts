import { z } from 'zod';

export const MessageSchema = z.object({
  system: z.string(),
  user: z.string(),
});
