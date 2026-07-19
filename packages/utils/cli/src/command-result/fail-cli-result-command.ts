import { type ResultError } from '@jearle/util-result';

import { failCLICommand } from './fail-cli-command';
import { type CLIContext } from '../types';

export type FailCLIResultCommandProps = {
  readonly error: ResultError;
};

export const failCLIResultCommand = (
  ctx: CLIContext,
  props: FailCLIResultCommandProps,
) => {
  const { error } = props;
  const message =
    error.code === undefined
      ? error.message
      : `${error.code}: ${error.message}`;
  const result = failCLICommand(ctx, { message });

  return result;
};
