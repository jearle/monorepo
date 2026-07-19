import { cors } from 'hono/cors';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';

import { addOpenAPI, getOnError, hono, loggerMiddleware } from '@jearle/lib-hono';
import { type Logger } from '@jearle/util-logger';

import { type Env } from '../env';
import { type Services } from '../services';
import { type Middlewares } from '../middlewares';
import { createHealthApp } from '../health-app';

export type CreateAppProps = {
  readonly env: Env;
  readonly logger: Logger;
  readonly services: Services;
  readonly middlewares: Middlewares;
};
export const createApp = (props: CreateAppProps) => {
  const { env, logger, services, middlewares } = props;
  const { onError } = getOnError();

  const app = hono().basePath(`/api/v1`);
  app.onError(onError);

  app.use(`*`, requestId());
  app.use(`*`, cors());
  app.use(`*`, secureHeaders());
  app.use(`*`, loggerMiddleware({ logger }));

  const { healthApp } = createHealthApp({
    env,
    services,
    middlewares,
  });

  app.route(`/health`, healthApp);

  addOpenAPI(`/open-api`, { title: `Health API`, app });

  const result = { app };

  return result;
};
