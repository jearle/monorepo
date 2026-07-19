import { type MiddlewareHandler } from 'hono';
import { pinoLogger } from 'hono-pino';

import { type Logger } from 'pino';

export type LoggerMiddlewareProps = {
  readonly logger: Logger;
};
export const loggerMiddleware = (props: LoggerMiddlewareProps) => {
  const { logger } = props;

  const nextLogger: MiddlewareHandler = pinoLogger({
    pino: logger,
  });

  return nextLogger;
};
