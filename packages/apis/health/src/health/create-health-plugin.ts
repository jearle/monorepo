import process from 'node:process';
import type { FastifyInstance } from 'fastify';

import type { HealthResponse } from '@lbb/schema-health';
import { HealthResponseSchema, STATUS_OK } from '@lbb/schema-health';

export const createHealthPlugin = () => {
  const healthPlugin = async (fastify: FastifyInstance) => {
    fastify.get(`/`, {
      schema: {
        description: `Get health status`,
        tags: [`health`],
        response: {
          200: HealthResponseSchema,
        },
      },
      handler: () => {
        const response: HealthResponse = {
          statusCode: 200,
          status: STATUS_OK,
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
        };

        return response;
      },
    });
  };

  const result = { healthPlugin };

  return result;
};
