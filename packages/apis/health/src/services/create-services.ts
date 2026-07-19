import { type ServicesContext } from './types';

export const createServices = (ctx: ServicesContext) => {
  void ctx;
  const services = {};

  const result = { services };

  return result;
};

export type Services = ReturnType<typeof createServices>[`services`];
