import { type Context } from 'hono';

import { type Env } from '../env';

export type PropsGetHostnameFromHeader = {
  readonly c: Context;
  readonly env: Env;
};
export const getHostnameFromHeader = (props: PropsGetHostnameFromHeader) => {
  const { c, env } = props;
  const { HOSTNAME, PORT } = env;

  const host = c.req.header(`host`) ?? `${HOSTNAME}:${PORT}`;
  const urlString = `http://${host}`;
  const url = new URL(urlString);
  const { hostname } = url;

  const result = { hostname };

  return result;
};
