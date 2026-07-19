import {
  type CLICommandResult,
  failCLICommand,
  readCLITextInput,
} from '@jearle/util-cli';
import { safeParse } from '@jearle/util-json';

import { type UtilsCommandContext } from '../utils-command';

export type UtilsHTTPBody = {
  readonly body?: string;
  readonly json?: unknown;
};

type ReadJSONBodyProps = {
  readonly cwd: string;
  readonly json?: string;
  readonly jsonFile?: string;
};

const readJSONBody = async (
  ctx: UtilsCommandContext,
  props: ReadJSONBodyProps,
): Promise<CLICommandResult<unknown | undefined>> => {
  const { cwd, json, jsonFile } = props;

  if (json !== undefined && jsonFile !== undefined) {
    const result = failCLICommand(ctx, {
      message: `Use either --json or --json-file, not both`,
    });

    return result;
  }

  if (json !== undefined) {
    const parseResult = safeParse(json);

    if (parseResult.success === false) {
      const result = failCLICommand(ctx, {
        message: parseResult.error.message,
      });

      return result;
    }

    const result: CLICommandResult<unknown> = {
      data: parseResult.data,
      success: true,
    };

    return result;
  }

  if (jsonFile === undefined) {
    const result: CLICommandResult<unknown> = {
      data: undefined,
      success: true,
    };

    return result;
  }

  const jsonTextResult = await readCLITextInput(ctx, {
    cwd,
    filePath: jsonFile,
  });

  if (jsonTextResult.success === false) {
    return jsonTextResult;
  }

  const parseResult = safeParse(jsonTextResult.data);

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

type ReadTextBodyProps = {
  readonly body?: string;
  readonly bodyFile?: string;
  readonly cwd: string;
};

const readTextBody = async (
  ctx: UtilsCommandContext,
  props: ReadTextBodyProps,
): Promise<CLICommandResult<string | undefined>> => {
  const { body, bodyFile, cwd } = props;

  if (body !== undefined && bodyFile !== undefined) {
    const result = failCLICommand(ctx, {
      message: `Use either --body or --body-file, not both`,
    });

    return result;
  }

  if (body !== undefined) {
    const result: CLICommandResult<string | undefined> = {
      data: body,
      success: true,
    };

    return result;
  }

  if (bodyFile === undefined) {
    const result: CLICommandResult<string | undefined> = {
      data: undefined,
      success: true,
    };

    return result;
  }

  const bodyResult = await readCLITextInput(ctx, {
    cwd,
    filePath: bodyFile,
  });

  return bodyResult;
};

export type ReadUtilsHTTPBodyProps = {
  readonly body?: string;
  readonly bodyFile?: string;
  readonly cwd: string;
  readonly json?: string;
  readonly jsonFile?: string;
};

export const readUtilsHTTPBody = async (
  ctx: UtilsCommandContext,
  props: ReadUtilsHTTPBodyProps,
): Promise<CLICommandResult<UtilsHTTPBody>> => {
  const { body, bodyFile, cwd, json, jsonFile } = props;
  const readJSONBodyProps = {
    cwd,
    ...(json === undefined ? {} : { json }),
    ...(jsonFile === undefined ? {} : { jsonFile }),
  };
  const jsonBodyResult = await readJSONBody(ctx, readJSONBodyProps);

  if (jsonBodyResult.success === false) {
    return jsonBodyResult;
  }

  const readTextBodyProps = {
    cwd,
    ...(body === undefined ? {} : { body }),
    ...(bodyFile === undefined ? {} : { bodyFile }),
  };
  const textBodyResult = await readTextBody(ctx, readTextBodyProps);

  if (textBodyResult.success === false) {
    return textBodyResult;
  }

  if (jsonBodyResult.data !== undefined && textBodyResult.data !== undefined) {
    const result = failCLICommand(ctx, {
      message: `Use either text body options or JSON body options, not both`,
    });

    return result;
  }

  const data = {
    ...(textBodyResult.data === undefined ? {} : { body: textBodyResult.data }),
    ...(jsonBodyResult.data === undefined ? {} : { json: jsonBodyResult.data }),
  };
  const result: CLICommandResult<UtilsHTTPBody> = {
    data,
    success: true,
  };

  return result;
};
