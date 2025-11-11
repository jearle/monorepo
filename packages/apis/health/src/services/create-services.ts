import { type Logger } from '@jearle/util-logger';

import { type Env } from '../env';

type PropsCreateServices = {
  readonly env: Env;
  readonly logger: Logger;
};
export const createServices = async (_props: PropsCreateServices) => {
  const services = {};

  const result = { services };

  return result;
};

export type Services = Awaited<ReturnType<typeof createServices>>[`services`];
