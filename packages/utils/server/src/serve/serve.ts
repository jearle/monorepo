import { RUNTIME_BUN, getRuntime } from '@jearle/util-runtime';

import { type PropsServe } from './types';
import { bunServe } from './bun-serve';

export const serve = async (props: PropsServe) => {
  const { runtime } = getRuntime();

  const isRuntimeBun = runtime === RUNTIME_BUN;
  if (isRuntimeBun === true) {
    const server = bunServe(props);

    return server;
  }

  throw new Error(`serve is unsupported for your runtime: ${runtime}`);
};
