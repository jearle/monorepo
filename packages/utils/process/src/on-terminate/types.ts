import { SIGNALS } from './constants';

export type Signal = (typeof SIGNALS)[number];

export type TerminateHandlerProps = {
  readonly signal: Signal;
};

export type TerminateHandlerResult = {
  readonly success: boolean;
};

export type TerminateHandler = (
  props: TerminateHandlerProps,
) => Promise<TerminateHandlerResult>;
