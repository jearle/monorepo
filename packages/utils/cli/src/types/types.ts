import { type Logger } from '@jearle/util-logger';

export type CLIContext<TEnv = unknown> = {
  readonly env: TEnv;
  readonly logger: Logger;
};
