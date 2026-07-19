import { swaggerUI } from '@hono/swagger-ui';

import { type AddOpenAPIOptions } from './types';

export const addOpenAPI = (path: string, options: AddOpenAPIOptions) => {
  const { app, title } = options;

  app.get(path, swaggerUI({ url: `.${path}/doc` }));

  app.get(`${path}/doc`, (c) => {
    const doc = app.getOpenAPIDocument({
      openapi: `3.1.0`,
      info: { title, version: `v1` },
    });
    return c.json(doc);
  });

  app.openAPIRegistry.registerComponent(`securitySchemes`, `Bearer`, {
    type: `http`,
    scheme: `bearer`,
  });
};
