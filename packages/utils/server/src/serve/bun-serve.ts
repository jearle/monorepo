import { type ServeProps } from './serve';

export const bunServe = async (props: ServeProps) => {
  const server = await Bun.serve(props);

  return server;
};
