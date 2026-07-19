import { safeStringify } from '@jearle/util-json';

import {
  type CLICommandResult,
  failCLICommand,
  setCLIFailureExitCode,
} from '../command-result';
import { type CLIContext } from '../types';

export type WriteCLIJSONErrorOutputProps = {
  readonly data: unknown;
  readonly space?: string;
};

export const writeCLIJSONErrorOutput = (
  ctx: CLIContext,
  props: WriteCLIJSONErrorOutputProps,
) => {
  const { data, space = `  ` } = props;
  const stringifyResult = safeStringify(data, space);

  if (stringifyResult.success === false) {
    const result = failCLICommand(ctx, {
      message: stringifyResult.error.message,
    });

    return result;
  }

  process.stderr.write(`${stringifyResult.data}\n`);
  setCLIFailureExitCode();

  const result: CLICommandResult<undefined> = {
    success: false,
  };

  return result;
};
