import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { setCookie } from 'hono/cookie';

import { createSecureCookieOptions } from '@jearle/lib-hono';
import { SuccessResponseSchema, type SuccessResponse } from '@jearle/schema-api';
import { CLIENT_ERROR_TYPE, type ClientError } from '@jearle/schema-error';
import { LoginUserSchema } from '@jearle/service-authentication';

import { type Env } from '../env';
import { type Services } from '../services';

import { type LoginSuccessResponse } from './types';
import { LoginSuccessResponseSchema } from './login-success-response-schema';

type PropsAddLoginRoutes = {
  readonly authenticationApp: OpenAPIHono;
  readonly env: Env;
  readonly services: Services;
};
export const addLoginRoutes = (props: PropsAddLoginRoutes) => {
  const { authenticationApp, env, services } = props;
  const { authentication } = services;

  const loginRoute = createRoute({
    method: `post`,
    path: `/login`,
    description: `Login with username and password`,
    request: {
      body: {
        content: {
          [`application/json`]: {
            schema: LoginUserSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: `Success`,
        headers: z.object({
          [`Set-Cookie`]: z.string().openapi({
            example: `refreshToken=abc123; HttpOnly; Path=/; Secure`,
          }),
        }),
        content: {
          [`application/json`]: {
            schema: LoginSuccessResponseSchema,
          },
        },
      },
      400: {
        description: `Fail`,
        content: {
          [`application/json`]: {
            schema: SuccessResponseSchema,
          },
        },
      },
    },
  });
  authenticationApp.openapi(loginRoute, async (c) => {
    const loginUser = c.req.valid(`json`);

    const loginResult = await authentication.login(loginUser);

    const { success: loginSuccess } = loginResult;

    if (!loginSuccess) {
      const timestamp = new Date().toISOString();
      const { error } = loginResult;
      const clientError: ClientError = {
        type: CLIENT_ERROR_TYPE,
        code: `Failed to login user`,
        message: error.message,
        timestamp,
        metadata: null,
      };

      const result: SuccessResponse = {
        clientErrors: [clientError],
        systemErrors: [],
        data: { success: false },
      };

      const response = c.json(result, 400);

      return response;
    }

    const { success, accessToken, refreshToken } = loginResult;

    const loginSuccessResponse: LoginSuccessResponse = {
      clientErrors: [],
      systemErrors: [],
      data: { success, accessToken },
    };

    const { cookieOptions } = createSecureCookieOptions({ env, c });
    setCookie(c, `refreshToken`, refreshToken, cookieOptions);

    const response = c.json(loginSuccessResponse, 200);

    return response;
  });
};
