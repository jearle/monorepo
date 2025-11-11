import { z } from 'zod';

import { UserStateSchema } from './user-state-schema';
import { UserSchema } from './user-schema';
import { LoginUserSchema } from './login-user-schema';
import { NewUserSchema } from './new-user-schema';

export type User = z.infer<typeof UserSchema>;
export type UserState = z.infer<typeof UserStateSchema>;
export type LoginUser = z.infer<typeof LoginUserSchema>;
export type NewUser = z.infer<typeof NewUserSchema>;
