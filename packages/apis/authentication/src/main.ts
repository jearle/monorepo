import { serve } from 'bun';

import { createEnv } from './env';
import { createAuthenticationLogger } from './logger';
import { createServerFetch } from './server-fetch';

export const main = async () => {
  const { env } = createEnv();
  const { logger } = createAuthenticationLogger({ env });

  const { fetch } = await createServerFetch({ env, logger });

  const { HOSTNAME: hostname, PORT: port } = env;
  const server = serve({ fetch, hostname, port });

  logger.info({
    message: 'Server started',
    href: server.url.href,
  });
};

main();
