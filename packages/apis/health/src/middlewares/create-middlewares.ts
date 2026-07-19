import { type Services } from '../services';

export type CreateMiddlewaresProps = {
  readonly services: Services;
};
export const createMiddlewares = (props: CreateMiddlewaresProps) => {
  void props;
  const middlewares = {};

  const result = { middlewares };

  return result;
};

export type Middlewares = ReturnType<typeof createMiddlewares>[`middlewares`];
