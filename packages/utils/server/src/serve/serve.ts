import { RUNTIME_BUN, getRuntime } from '@jearle/util-runtime';

import { bunServe } from './bun-serve';

export type ServeProps = {
  readonly fetch: (req: Request) => Response | Promise<Response>;
  readonly hostname: string;
  readonly port: number;
};

export const serve = async (props: ServeProps) => {
  const { runtime } = getRuntime();

  const isRuntimeBun = runtime === RUNTIME_BUN;
  if (isRuntimeBun === true) {
    const server = bunServe(props);

    return server;
  }

  throw new Error(`serve is unsupported for your runtime: ${runtime}`);
};
