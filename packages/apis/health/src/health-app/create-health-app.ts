import { hono } from '@jearle/lib-hono';

import { type Env } from '../env';
import { type Services } from '../services';
import { type Middlewares } from '../middlewares';

import { addRootRoutes } from './add-root-routes';

export type CreateHealthAppProps = {
  readonly env: Env;
  readonly services: Services;
  readonly middlewares: Middlewares;
};
export const createHealthApp = (props: CreateHealthAppProps) => {
  void props;
  const healthApp = hono();

  addRootRoutes({ healthApp });

  const result = { healthApp };

  return result;
};
