import { z } from 'zod';

import {
  scoreStrongPassword,
  STRONG_PASSWORD_THRESHOLD,
  STRONG_PASSWORD_OPTIONS_DEFAULT_JSON,
} from '@jearle/util-validator';

export const LoginUserSchema = z.object({
  email: z.email(),
  password: z.string().check((ctx) => {
    const { value } = ctx;

    const strongPasswordScore = scoreStrongPassword(value);
    const isStrongPassword = strongPasswordScore >= STRONG_PASSWORD_THRESHOLD;

    if (isStrongPassword) {
      return;
    }

    const issue = {
      code: `invalid_format` as const,
      message: `Password does not meet the strength requirement`,
      input: `******`,
      format: STRONG_PASSWORD_OPTIONS_DEFAULT_JSON,
    };

    ctx.issues.push(issue);
  }),
});
