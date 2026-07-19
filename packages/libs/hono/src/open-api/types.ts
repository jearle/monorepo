import { type OpenAPIHono } from '@hono/zod-openapi';

export type AddOpenAPIOptions = {
  readonly app: OpenAPIHono;
  readonly title: string;
};
