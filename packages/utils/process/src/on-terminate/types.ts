import { SIGNALS } from './constants';

export type Signal = (typeof SIGNALS)[number];

export type PropsTerminateHandler = {
  readonly signal: Signal;
};

export type ResultTerminateHandler = {
  readonly success: boolean;
};

export type TerminateHandler = (
  props: PropsTerminateHandler,
) => Promise<ResultTerminateHandler>;
