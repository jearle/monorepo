import { safeStringify } from '@jearle/util-json';

import { type CLICommandResult, failCLICommand } from '../command-result';
import { type CLIContext } from '../types';
import { writeCLIStdoutLine } from './write-cli-stdout-line';

export type WriteCLIJSONOutputProps = {
  readonly data: unknown;
  readonly space?: string;
};

export const writeCLIJSONOutput = (
  ctx: CLIContext,
  props: WriteCLIJSONOutputProps,
) => {
  const { data, space = `  ` } = props;
  const stringifyResult = safeStringify(data, space);

  if (stringifyResult.success === false) {
    const result = failCLICommand(ctx, {
      message: stringifyResult.error.message,
    });

    return result;
  }

  writeCLIStdoutLine(ctx, { data: stringifyResult.data });

  const result: CLICommandResult<undefined> = {
    data: undefined,
    success: true,
  };

  return result;
};
