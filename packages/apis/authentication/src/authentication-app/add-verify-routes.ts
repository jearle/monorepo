import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { SuccessResponseSchema, type SuccessResponse } from '@jearle/schema-api';

import { type Services } from '../services';
import { type Middlewares } from '../middlewares';

type PropsAddVerifyRoutes = {
  readonly authenticationApp: OpenAPIHono;
  readonly services: Services;
  readonly middlewares: Middlewares;
};
export const addVerifyRoutes = (props: PropsAddVerifyRoutes) => {
  const { authenticationApp, middlewares } = props;
  const { authenticationMiddleware } = middlewares;

  const verifyRoute = createRoute({
    method: `get`,
    path: `/verify`,
    security: [{ Bearer: [] }],
    responses: {
      200: {
        description: `Authentication`,
        content: {
          [`application/json`]: {
            schema: SuccessResponseSchema,
          },
        },
      },
    },
  });
  authenticationApp.use(verifyRoute.path, authenticationMiddleware);
  authenticationApp.openapi(verifyRoute, async (c) => {
    const response: SuccessResponse = {
      clientErrors: [],
      systemErrors: [],
      data: { success: true },
    };

    return c.json(response, 200);
  });
};
