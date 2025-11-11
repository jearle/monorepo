import { expect, test } from 'bun:test';

import { createPostgresDatabase } from '@jearle/lib-postgres';

import { createAuthentication } from './create-authentication';
import { createUsers } from '../users';
import { createUserTokens } from '../user-tokens';

const { DATABASE_URL } = process.env as { readonly [key: string]: string };

const STRONG_PASSWORD = `Str0nG! @ P4ssw0rD`;
const VALID_EMAIL = `valid@email.com`;

test(`createAuthenitcation({ db })
  authentication.signUp({ email, firstName, lastName, password })
  authentication.login({ email password })
  authentication.authenticate({ accessToken })
  authentication.refresh({ refreshToken })
  authentication.logout({ refreshToken })`, async () => {
  const { db } = await createPostgresDatabase({
    connectionString: DATABASE_URL!,
  });
  const { users } = createUsers({ db });
  const { userTokens } = createUserTokens({ db });

  const { authentication } = createAuthentication({
    users,
    userTokens,
    jwtSecret: `TEST_SECRET`,
  });

  const testUser = {
    email: VALID_EMAIL,
    password: STRONG_PASSWORD,
    confirmPassword: STRONG_PASSWORD,
  };

  // signUp
  const signUpResult = await authentication.signUp(testUser);

  const { success: signUpSuccess } = signUpResult;

  if (signUpSuccess === false) {
    const { error } = signUpResult;
    console.error(error);
    expect(signUpSuccess).toBeTrue();
    return;
  }

  const { user: signUpUser } = signUpResult;

  expect(signUpUser).toBeDefined();

  // login
  const loginResult = await authentication.login({
    email: testUser.email,
    password: testUser.password,
  });
  const { success: loginSuccess } = loginResult;

  if (loginSuccess === false) {
    const { error } = loginResult;
    console.error(error);
    expect(loginSuccess).toBeTrue();
    return;
  }
  const { accessToken, refreshToken, user: loginUser } = loginResult;
  expect(accessToken).toBeDefined();
  expect(refreshToken).toBeDefined();
  expect(loginUser).toBeDefined();

  // authenticate
  const authenticateResult = await authentication.authenticate({ accessToken });
  const { success: authenticateSuccess } = authenticateResult;
  if (authenticateSuccess === false) {
    const { error } = authenticateResult;
    console.error(error);
  }
  expect(authenticateSuccess).toBeTrue();

  // refresh
  const refreshResult = await authentication.refresh({ refreshToken });

  const { success: refreshSuccess } = refreshResult;

  if (refreshSuccess === false) {
    const { error } = refreshResult;
    console.error(error);
    expect(refreshSuccess).toBeTrue();
    return;
  }

  const {
    accessToken: refreshAccesstoken,
    refreshToken: refreshRefreshToken,
    user: refreshUser,
  } = refreshResult;
  expect(refreshAccesstoken).toBeDefined();
  expect(refreshRefreshToken).toBeDefined();
  expect(refreshUser).toBeDefined();

  // logout
  const logoutResult = await authentication.logout({
    refreshToken: refreshRefreshToken,
  });
  const { success } = logoutResult;
  expect(success).toBeTrue();

  // cleanup
  await users.destroy({ id: loginUser.id });
});
