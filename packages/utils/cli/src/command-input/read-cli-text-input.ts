import { readFile } from 'node:fs/promises';

import { type CLICommandResult, failCLICommand } from '../command-result';
import { type CLIContext } from '../types';
import { getCLIInputErrorMessage } from './errors';
import { resolveCLIInputPath } from './resolve-cli-input-path';

export type ReadCLITextInputProps = {
  readonly cwd: string;
  readonly filePath: string | undefined;
};

export const readCLITextInput = async (
  ctx: CLIContext,
  props: ReadCLITextInputProps,
): Promise<CLICommandResult<string>> => {
  const { cwd, filePath } = props;

  if (filePath === undefined) {
    const data = await Bun.stdin.text();
    const result: CLICommandResult<string> = {
      data,
      success: true,
    };

    return result;
  }

  const inputPath = resolveCLIInputPath({ cwd, filePath });

  try {
    const data = await readFile(inputPath, `utf8`);
    const result: CLICommandResult<string> = {
      data,
      success: true,
    };

    return result;
  } catch (error) {
    const message = getCLIInputErrorMessage(error);
    const result = failCLICommand(ctx, { message });

    return result;
  }
};
