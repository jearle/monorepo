import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';

type OptionsAddOpenAPI = {
  readonly app: OpenAPIHono;
};
export const addOpenAPI = (path: string, options: OptionsAddOpenAPI) => {
  const { app } = options;

  app.get(path, swaggerUI({ url: `.${path}/doc` }));

  app.doc(`${path}/doc`, {
    openapi: '3.1.0',
    info: {
      title: `Authentication API`,
      version: 'v1',
    },
  });
  app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
    type: 'http',
    scheme: 'bearer',
  });
};
