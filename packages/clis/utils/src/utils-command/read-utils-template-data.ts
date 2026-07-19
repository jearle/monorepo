import {
  type CLICommandResult,
  failCLICommand,
  readCLIJSONInput,
} from '@jearle/util-cli';
import { type TemplateData } from '@jearle/util-template';

import { type UtilsCommandContext } from './types';

const checkIsTemplateData = (value: unknown): value is TemplateData => {
  const result =
    value !== null &&
    typeof value === `object` &&
    Array.isArray(value) === false;

  return result;
};

export type ReadUtilsTemplateDataProps = {
  readonly cwd: string;
  readonly filePath: string;
};

export const readUtilsTemplateData = async (
  ctx: UtilsCommandContext,
  props: ReadUtilsTemplateDataProps,
): Promise<CLICommandResult<TemplateData>> => {
  const { cwd, filePath } = props;
  const dataResult = await readCLIJSONInput(ctx, {
    cwd,
    filePath,
  });

  if (dataResult.success === false) {
    return dataResult;
  }

  if (checkIsTemplateData(dataResult.data) === false) {
    const result = failCLICommand(ctx, {
      message: `Template data must be a JSON object`,
    });

    return result;
  }

  const result: CLICommandResult<TemplateData> = {
    data: dataResult.data,
    success: true,
  };

  return result;
};
