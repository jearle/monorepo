import { type Context } from 'hono';

import { type Env } from '../env';

import { getHostnameFromHeader } from './get-hostname-from-header';

export type PropsGetCookieDomain = {
  readonly env: Env;
  readonly c: Context;
};
export const getCookieDomain = (props: PropsGetCookieDomain) => {
  const { env, c } = props;
  const { hostname } = getHostnameFromHeader({ env, c });

  const domain =
    hostname === 'localhost'
      ? undefined
      : `.${hostname.split('.').slice(-2).join('.')}`;

  const result = { domain };

  return result;
};
