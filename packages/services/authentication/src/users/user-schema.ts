import { z } from 'zod';
import { UserStateSchema } from './user-state-schema';

export const UserSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  email: z.email({ message: 'Invalid email format' }).max(255),
  firstName: z.string().max(255).nullable().optional(),
  lastName: z.string().max(255).nullable().optional(),
  avatarUrl: z
    .url({ message: 'Invalid URL format' })
    .max(500)
    .nullable()
    .optional(),

  passwordHash: z.string().max(255),
  emailVerified: z.boolean().default(false),
  emailVerificationToken: z.string().max(255).nullable().optional(),
  passwordResetToken: z.string().max(255).nullable().optional(),
  passwordResetExpiresAt: z.coerce.date().nullable().optional(),
  jwtVersion: z
    .number()
    .int()
    .positive({ message: 'JWT version must be positive' })
    .default(1),

  state: UserStateSchema.default('pending_verification'),
  lastLoginAt: z.coerce.date().nullable().optional(),
  loginCount: z.number().int().nonnegative().default(0),

  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
  deletedAt: z.coerce.date().nullable().optional(),
});
