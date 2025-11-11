import type { Services } from '../services';
import { createAuthenticationMiddleware } from '../authentication-app';

type PropsCreateMiddlewares = {
  readonly services: Services;
};
export const createMiddlewares = (props: PropsCreateMiddlewares) => {
  const { services } = props;
  const { authentication } = services;

  const { authenticationMiddleware } = createAuthenticationMiddleware({
    authentication,
  });

  const middlewares = {
    authenticationMiddleware,
  };

  const result = { middlewares };

  return result;
};

export type Middlewares = ReturnType<typeof createMiddlewares>[`middlewares`];
