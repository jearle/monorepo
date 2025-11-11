import { hono } from '@jearle/lib-hono';

import { type Services } from '../services';
import { type Middlewares } from '../middlewares';
import { type Env } from '../env';

import { addRootRoutes } from './add-root-routes';
import { addSignUpRoutes } from './add-sign-up-routes';
import { addLoginRoutes } from './add-login-routes';
import { addRefreshRoutes } from './add-refresh-routes';
import { addVerifyRoutes } from './add-verify-routes';
import { addLogoutRoutes } from './add-logout-routes';

type PropsCreateAuthenticationApp = {
  readonly env: Env;
  readonly services: Services;
  readonly middlewares: Middlewares;
};
export const createAuthenticationApp = (
  props: PropsCreateAuthenticationApp,
) => {
  const { env, services, middlewares } = props;

  const authenticationApp = hono();

  const routeProps = { authenticationApp, env, services, middlewares };
  addRootRoutes(routeProps);
  addSignUpRoutes(routeProps);
  addLoginRoutes(routeProps);
  addRefreshRoutes(routeProps);
  addVerifyRoutes(routeProps);
  addLogoutRoutes(routeProps);

  const result = { authenticationApp };

  return result;
};
