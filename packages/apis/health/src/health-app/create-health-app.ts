import { hono } from '@jearle/lib-hono';

import { type Services } from '../services';
import { type Middlewares } from '../middlewares';

import { addRootRoutes } from './add-root-routes';

type PropsCreateHealthApp = {
  readonly services: Services;
  readonly middlewares: Middlewares;
};
export const createHealthApp = (_props: PropsCreateHealthApp) => {
  const healthApp = hono();

  addRootRoutes({ healthApp });

  const result = { healthApp };

  return result;
};
