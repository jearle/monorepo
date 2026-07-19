import { type Env, type ErrorHandler } from 'hono';

import { createOnErrorResponse } from './errors';

export const getOnError = () => {
  const onError: ErrorHandler<Env> = (error, c) => {
    const response = createOnErrorResponse({ error });
    return c.json(response, 500);
  };

  const result = { onError };

  return result;
};
