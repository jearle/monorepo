import { type Context } from 'hono';
import { type CookieOptions } from 'hono/utils/cookie';

import { getCookieDomain } from '@jearle/lib-hono';
import { NODE_ENV_DEVELOPMENT, NODE_ENV_PRODUCTION } from '@jearle/util-env';

import { type Env } from '../env';

export type PropsCreateSecureCookieOptions = {
  readonly env: Env;
  readonly c: Context;
};
export const createSecureCookieOptions = (
  props: PropsCreateSecureCookieOptions,
) => {
  const { env, c } = props;
  const { NODE_ENV } = env;
  const isProduction = NODE_ENV === NODE_ENV_PRODUCTION;
  const isDevelopment = NODE_ENV === NODE_ENV_DEVELOPMENT;

  const httpOnly = true;
  const path = `/`;

  if (isProduction === true) {
    const { domain } = getCookieDomain({ env, c });
    const domainProp = domain === undefined ? {} : { domain };

    const cookieOptions: CookieOptions = {
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 24 * 14,
      httpOnly,
      path,
      ...domainProp,
    };

    const result = { cookieOptions };

    return result;
  }

  if (isDevelopment === true) {
    const cookieOptions: CookieOptions = {
      secure: false,
      sameSite: 'lax',
      httpOnly,
      path,
    };

    const result = { cookieOptions };

    return result;
  }

  const cookieOptions: CookieOptions = {
    secure: true,
    sameSite: 'none',
    httpOnly,
    path,
  };

  const result = { cookieOptions };

  return result;
};
