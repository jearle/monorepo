import { type Env, type ErrorHandler } from 'hono';

import { type BaseResponse } from '@jearle/schema-api';
import { type SystemError, SYSTEM_ERROR_TYPE } from '@jearle/schema-error';

export const getOnError = () => {
  const onError: ErrorHandler<Env> = (error, c) => {
    console.log(`onError`);
    const { message, stack = null } = error;

    const timestamp = new Date().toISOString();

    const systemError: SystemError = {
      type: SYSTEM_ERROR_TYPE,
      code: `SYSTEM_ERROR`,
      message,
      stack,
      timestamp,
      metadata: {},
    };

    const response: BaseResponse = {
      clientErrors: [],
      systemErrors: [systemError],
      data: {},
    };
    return c.json(response, 500);
  };

  const result = { onError };

  return result;
};
