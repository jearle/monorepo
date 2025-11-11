import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { SuccessResponseSchema, type SuccessResponse } from '@jearle/schema-api';

type PropsAddRootRoutes = {
  readonly authenticationApp: OpenAPIHono;
};
export const addRootRoutes = (props: PropsAddRootRoutes) => {
  const { authenticationApp } = props;

  const rootRoute = createRoute({
    method: `get`,
    path: `/`,
    responses: {
      200: {
        description: `Success`,
        content: {
          [`application/json`]: {
            schema: SuccessResponseSchema,
          },
        },
      },
    },
  });
  authenticationApp.openapi(rootRoute, async (c) => {
    const response: SuccessResponse = {
      clientErrors: [],
      systemErrors: [],
      data: { success: true },
    };

    return c.json(response);
  });
};
