import { safeParse } from '@jearle/util-json';

import { type CLICommandResult, failCLICommand } from '../command-result';
import { type CLIContext } from '../types';
import { readCLITextInput } from './read-cli-text-input';

export type ReadCLIJSONInputProps = {
  readonly cwd: string;
  readonly filePath: string | undefined;
};

export const readCLIJSONInput = async (
  ctx: CLIContext,
  props: ReadCLIJSONInputProps,
): Promise<CLICommandResult<unknown>> => {
  const textResult = await readCLITextInput(ctx, props);

  if (textResult.success === false) {
    return textResult;
  }

  const parseResult = safeParse(textResult.data);

  if (parseResult.success === false) {
    const result = failCLICommand(ctx, { message: parseResult.error.message });

    return result;
  }

  const result: CLICommandResult<unknown> = {
    data: parseResult.data,
    success: true,
  };

  return result;
};
