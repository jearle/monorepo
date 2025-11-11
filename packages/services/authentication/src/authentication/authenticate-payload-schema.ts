import { z } from 'zod';

export const AuthenticatePayloadSchema = z.object({
  accessToken: z.string(),
});
