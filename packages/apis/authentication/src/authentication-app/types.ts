import { z } from 'zod';

import type { LoginSuccessResponseSchema } from './login-success-response-schema';

export type LoginSuccessResponse = z.infer<typeof LoginSuccessResponseSchema>;
