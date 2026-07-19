import { RUNTIMES } from './constants';

export type Runtime = (typeof RUNTIMES)[number];

export type GetRunTimeResult = {
  readonly runtime: Runtime;
};
