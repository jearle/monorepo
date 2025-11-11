import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { getCookie, setCookie } from 'hono/cookie';

import { createSecureCookieOptions } from '@jearle/lib-hono';
import { SuccessResponseSchema, type SuccessResponse } from '@jearle/schema-api';
import { CLIENT_ERROR_TYPE, type ClientError } from '@jearle/schema-error';

import type { Env } from '../env';
import type { Services } from '../services';

import { LoginSuccessResponseSchema } from './login-success-response-schema';
import type { LoginSuccessResponse } from './types';

type PropsAddRefreshRoutes = {
  readonly authenticationApp: OpenAPIHono;
  readonly env: Env;
  readonly services: Services;
};
export const addRefreshRoutes = (props: PropsAddRefreshRoutes) => {
  const { authenticationApp, env, services } = props;
  const { authentication } = services;

  const refreshRoute = createRoute({
    method: `post`,
    path: `/refresh`,
    description: `Refresh with refresh token`,
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
  authenticationApp.openapi(refreshRoute, async (c) => {
    const refreshToken = getCookie(c, `refreshToken`) ?? ``;

    const refreshResult = await authentication.refresh({ refreshToken });

    const { success: refreshSuccess } = refreshResult;

    if (!refreshSuccess) {
      const timestamp = new Date().toISOString();
      const { error } = refreshResult;
      const clientError: ClientError = {
        type: CLIENT_ERROR_TYPE,
        code: `Failed to refresh user`,
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

    const {
      success,
      accessToken,
      refreshToken: nextRefreshToken,
    } = refreshResult;

    const refreshSuccessResponse: LoginSuccessResponse = {
      clientErrors: [],
      systemErrors: [],
      data: { success, accessToken },
    };

    const { cookieOptions } = createSecureCookieOptions({ env, c });
    setCookie(c, `refreshToken`, nextRefreshToken, cookieOptions);

    const response = c.json(refreshSuccessResponse, 200);

    return response;
  });
};
