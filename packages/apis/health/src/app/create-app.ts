import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import { createHealthPlugin } from '../health';

export const createApp = () => {
  const app = Fastify({ logger: true });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  const { healthPlugin } = createHealthPlugin();

  app.register(healthPlugin, { prefix: `/health` });

  return app;
};
