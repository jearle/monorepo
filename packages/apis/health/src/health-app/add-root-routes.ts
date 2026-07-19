import { type OpenAPIHono, createRoute } from '@hono/zod-openapi';

import {
  type HealthData,
  type HealthResponse,
  HEALTH_STATUS_OK,
  HealthResponseSchema,
} from '../schema';

const timestamp = new Date().toISOString();

export type AddRootRoutesProps = {
  readonly healthApp: OpenAPIHono;
};
export const addRootRoutes = (props: AddRootRoutesProps) => {
  const { healthApp } = props;

  const rootRoute = createRoute({
    method: `get`,
    path: `/`,
    responses: {
      200: {
        description: `Success`,
        content: {
          [`application/json`]: {
            schema: HealthResponseSchema,
          },
        },
      },
    },
  });
  healthApp.openapi(rootRoute, async (c) => {
    const healthData: HealthData = {
      statusCode: 200,
      status: HEALTH_STATUS_OK,
      timestamp,
      uptime: process.uptime(),
    };

    const healthResponse: HealthResponse = {
      clientErrors: [],
      systemErrors: [],
      data: healthData,
    };

    const response = c.json(healthResponse, 200);

    return response;
  });
};
