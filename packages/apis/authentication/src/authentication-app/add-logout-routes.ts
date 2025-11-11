import { getCookie } from 'hono/cookie';
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { SuccessResponseSchema, type SuccessResponse } from '@jearle/schema-api';
import { CLIENT_ERROR_TYPE, type ClientError } from '@jearle/schema-error';

import { type Services } from '../services';
import { type Middlewares } from '../middlewares';

type PropsAddLogoutRoutes = {
  readonly authenticationApp: OpenAPIHono;
  readonly services: Services;
  readonly middlewares: Middlewares;
};
export const addLogoutRoutes = (props: PropsAddLogoutRoutes) => {
  const { authenticationApp, services, middlewares } = props;
  const { authentication } = services;
  const { authenticationMiddleware } = middlewares;

  const logoutRoute = createRoute({
    method: `get`,
    path: `/logout`,
    security: [{ Bearer: [] }],
    responses: {
      200: {
        description: `Success`,
        content: {
          [`application/json`]: {
            schema: SuccessResponseSchema,
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
  authenticationApp.use(logoutRoute.path, authenticationMiddleware);
  authenticationApp.openapi(logoutRoute, async (c) => {
    const refreshToken = getCookie(c, `refreshToken`) ?? ``;

    const logoutResult = await authentication.logout({ refreshToken });

    const { success: logoutSuccess } = logoutResult;

    if (!logoutSuccess) {
      const timestamp = new Date().toISOString();
      const { error } = logoutResult;
      const clientError: ClientError = {
        type: CLIENT_ERROR_TYPE,
        code: `Failed to logout user`,
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

    const response: SuccessResponse = {
      clientErrors: [],
      systemErrors: [],
      data: { success: true },
    };

    return c.json(response, 200);
  });
};
