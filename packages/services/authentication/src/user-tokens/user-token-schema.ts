import { z } from 'zod';

import { TokenTypeSchema } from './token-type-schema';

export const UserTokenSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  userId: z.uuid(),
  token: z.string().min(1),
  tokenType: TokenTypeSchema,
  expiresAt: z.date(),
  createdAt: z.date().default(() => new Date()),
  revokedAt: z.date().optional().nullable(),
  deviceFingerprint: z.string().max(255).optional(),
  clientName: z.string().max(100).optional(),
});
