import type { MiddlewareHandler } from 'hono';
import { pinoLogger } from 'hono-pino';

import { type Logger } from 'pino';

type PropsLoggerMiddleware = {
  readonly logger: Logger;
};
export const loggerMiddleware = (props: PropsLoggerMiddleware) => {
  const { logger } = props;

  const nextLogger: MiddlewareHandler = (c, next) => {
    const middlewarePinoLogger = pinoLogger({
      pino: logger,
      nodeRuntime: true,
    })(c, next);

    return middlewarePinoLogger;
  };

  return nextLogger;
};
