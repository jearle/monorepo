import { z } from 'zod';

export const PayloadSchema = z.object({
  userId: z.string(),
  jwtVersion: z.number(),
});
