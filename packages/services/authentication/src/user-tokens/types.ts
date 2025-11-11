import { z } from 'zod';

import { UserTokenSchema } from './user-token-schema';
import { TokenTypeSchema } from './token-type-schema';

export type UserToken = z.infer<typeof UserTokenSchema>;
export type TokenType = z.infer<typeof TokenTypeSchema>;
