import { type z } from 'zod';

import { type TerminalColorEnvironmentSchema } from './terminal-color-schema';

export type TerminalColorEnvironment = z.infer<
  typeof TerminalColorEnvironmentSchema
>;

export type TerminalColorizerResult = {
  readonly bold: (value: string) => string;
  readonly cyan: (value: string) => string;
  readonly dim: (value: string) => string;
  readonly green: (value: string) => string;
  readonly red: (value: string) => string;
  readonly yellow: (value: string) => string;
};
