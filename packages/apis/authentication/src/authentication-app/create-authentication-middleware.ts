import { type Context, type Next, type MiddlewareHandler } from 'hono';
import { type SuccessResponse } from '@jearle/schema-api';
import { type ClientError, CLIENT_ERROR_TYPE } from '@jearle/schema-error';
import { type Authentication } from '@jearle/service-authentication';

type PropsCreateAuthenticationMiddleware = {
  readonly authentication: Authentication;
};

export const createAuthenticationMiddleware = (
  props: PropsCreateAuthenticationMiddleware,
) => {
  const { authentication } = props;

  const authenticationMiddleware: MiddlewareHandler = async (
    c: Context,
    next: Next,
  ) => {
    const authorization = c.req.header('authorization');
    const accessToken =
      typeof authorization === 'string'
        ? authorization.replace('Bearer ', '')
        : '';

    const authenticateResult = await authentication.authenticate({
      accessToken,
    });
    const { success: authenticateSuccess } = authenticateResult;

    if (authenticateSuccess === true) {
      await next();
      return;
    }

    const timestamp = new Date().toISOString();
    const { error } = authenticateResult;
    const clientError: ClientError = {
      type: CLIENT_ERROR_TYPE,
      code: 'Failed to authenticate user',
      message: error.message,
      timestamp,
      metadata: null,
    };

    const result: SuccessResponse = {
      clientErrors: [clientError],
      systemErrors: [],
      data: { success: false },
    };

    return c.json(result, 400);
  };

  return { authenticationMiddleware };
};
