import { type Logger } from '@jearle/util-logger';

import { type Env } from '../env';
import { createServices } from '../services';
import { createApp } from '../app';
import { createMiddlewares } from '../middlewares';

export type PropsCreateServerFetch = {
  readonly logger: Logger;
  readonly env: Env;
};
export const createServerFetch = async (props: PropsCreateServerFetch) => {
  const { env, logger } = props;

  const { services } = await createServices({ env, logger });
  const { middlewares } = createMiddlewares({ services });
  const { app } = createApp({ env, logger, services, middlewares });
  const { fetch } = app;

  const result = { fetch };

  return result;
};
