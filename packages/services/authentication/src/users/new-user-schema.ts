import { z } from 'zod';

import { LoginUserSchema } from './login-user-schema';

export const NewUserSchema = LoginUserSchema.extend({
  confirmPassword: z.string(),
}).check((ctx) => {
  const { value } = ctx;
  const { password, confirmPassword } = value;

  const arePasswordsMatched = password === confirmPassword;

  if (arePasswordsMatched) {
    return;
  }

  const issue = {
    code: `invalid_format` as const,
    message: `password and confirm password do not match`,
    input: `******`,
    format: `password === confirmPassword`,
    path: [`confirmPassword`],
  };

  ctx.issues.push(issue);
});
