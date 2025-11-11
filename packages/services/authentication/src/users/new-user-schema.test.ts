import { test, expect } from 'bun:test';

import { NewUserSchema } from './new-user-schema';

const VALID_EMAIL = `valid@email.com`;
const INVALID_EMAIL = `invalid-email`;
const STRONG_PASSWORD = `Str0nG! @ P4ssw0rD`;
const WEAK_PASSWORD = `weak`;

const VALID_USER = {
  email: VALID_EMAIL,
  password: STRONG_PASSWORD,
  confirmPassword: STRONG_PASSWORD,
};

const INVALID_USER_EMAIL = {
  email: INVALID_EMAIL,
  password: STRONG_PASSWORD,
  confirmPassword: STRONG_PASSWORD,
};

const INVALID_USER_PASSWORD = {
  email: VALID_EMAIL,
  password: WEAK_PASSWORD,
  confirmPassword: WEAK_PASSWORD,
};

const INVALID_USER_CONFIRM_PASSWORD = {
  email: VALID_EMAIL,
  password: STRONG_PASSWORD,
  confirmPassword: WEAK_PASSWORD,
};

const safeParseInvalidResultPaths = (invalidUser: unknown) => {
  const parsedNewUserResult = NewUserSchema.safeParse(invalidUser);
  const { success } = parsedNewUserResult;

  if (success === true) {
    expect(success).toBeFalse();
    return [];
  }

  const { error } = parsedNewUserResult;
  const { issues } = error;

  const paths = issues.reduce((accPaths, nextIssue) => {
    const { path } = nextIssue;

    const nextAccPaths = [...accPaths, ...path];

    return nextAccPaths;
  }, [] as PropertyKey[]);

  return paths;
};

test(`NewUserSchema.safeParse(VALID_USER)`, () => {
  const parsedNewUserResult = NewUserSchema.safeParse(VALID_USER);
  const { success } = parsedNewUserResult;

  if (success === false) {
    expect(success).toBeTrue();
    return;
  }

  const { data } = parsedNewUserResult;
  expect(data).toBeDefined();
});

test(`NewUserSchema.safeParse(INVALID_USER_EMAIL)`, () => {
  const paths = safeParseInvalidResultPaths(INVALID_USER_EMAIL);
  expect(paths).toContainAllValues([`email`]);
});

test(`NewUserSchema.safeParse(INVALID_USER_PASSWORD)`, () => {
  const paths = safeParseInvalidResultPaths(INVALID_USER_PASSWORD);
  expect(paths).toContainAllValues([`password`]);
});

test(`NewUserSchema.safeParse(INVALID_USER_CONFIRM_PASSWORD)`, () => {
  const paths = safeParseInvalidResultPaths(INVALID_USER_CONFIRM_PASSWORD);
  expect(paths).toContainAllValues([`confirmPassword`]);
});
