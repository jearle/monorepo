import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { SuccessResponseSchema, type SuccessResponse } from '@jearle/schema-api';

import type { Services } from '../services';
import { CLIENT_ERROR_TYPE, type ClientError } from '@jearle/schema-error';
import { NewUserSchema } from '@jearle/service-authentication';

type PropsAddSignUpRoutes = {
  readonly authenticationApp: OpenAPIHono;
  readonly services: Services;
};
export const addSignUpRoutes = (props: PropsAddSignUpRoutes) => {
  const { authenticationApp, services } = props;
  const { authentication } = services;

  const signUpRoute = createRoute({
    method: `post`,
    path: `/sign-up`,
    description: `Sign-up with an email and password`,
    request: {
      body: {
        content: {
          [`application/json`]: {
            schema: NewUserSchema,
          },
        },
      },
    },
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
  authenticationApp.openapi(signUpRoute, async (c) => {
    const newUser = c.req.valid(`json`);

    const signUpResult = await authentication.signUp(newUser);

    const { success: signUpSuccess } = signUpResult;

    if (!signUpSuccess) {
      const timestamp = new Date().toISOString();
      const { error } = signUpResult;
      const clientError: ClientError = {
        type: CLIENT_ERROR_TYPE,
        code: `Failed to create user`,
        message: error.message,
        timestamp,
        metadata: null,
      };

      const response: SuccessResponse = {
        clientErrors: [clientError],
        systemErrors: [],
        data: { success: false },
      };

      return c.json(response, 400);
    }

    const { success } = signUpResult;

    const response: SuccessResponse = {
      clientErrors: [],
      systemErrors: [],
      data: { success },
    };

    return c.json(response);
  });
};
