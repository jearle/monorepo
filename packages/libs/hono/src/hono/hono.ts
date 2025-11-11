import { OpenAPIHono } from '@hono/zod-openapi';

import { getDefaultHook } from '../default-hook';

export const hono = () => {
  const { defaultHook } = getDefaultHook();

  const app = new OpenAPIHono({
    defaultHook,
  });

  return app;
};
