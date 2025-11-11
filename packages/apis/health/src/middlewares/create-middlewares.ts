import { type Logger } from '@jearle/util-logger';

import { type Services } from '../services';

type PropsCreateMiddlewares = {
  readonly services: Services;
  readonly logger: Logger;
};
export const createMiddlewares = (_props: PropsCreateMiddlewares) => {
  const middlewares = {};

  const result = { middlewares };

  return result;
};

export type Middlewares = ReturnType<typeof createMiddlewares>[`middlewares`];
