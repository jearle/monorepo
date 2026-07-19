import { type TerminalColorEnvironment } from './types';

export const DEFAULT_TERMINAL_COLOR_ENVIRONMENT: TerminalColorEnvironment = {};

export const DEFAULT_TERMINAL_COLOR_IS_TTY = false;

export const DEFAULT_CHECK_SHOULD_USE_COLOR_PROPS = {
  env: DEFAULT_TERMINAL_COLOR_ENVIRONMENT,
  isTTY: DEFAULT_TERMINAL_COLOR_IS_TTY,
} as const;
