import type { PropsServe } from './types';

export const bunServe = async (props: PropsServe) => {
  const server = await Bun.serve(props);

  return server;
};
