import { type HandlerArgs, defineCommand, option } from '@bunli/core';
import {
  failCLIResultCommand,
  resolveCLIInputPath,
  writeCLIStdout,
} from '@jearle/util-cli';
import { RESULT_STATUS_ERROR } from '@jearle/util-result';
import { createTemplateClient } from '@jearle/util-template';
import { z } from 'zod';

import {
  COMMAND_UTILS_TEMPLATE_RENDER_FILE,
  COMMAND_UTILS_TEMPLATE_RENDER_FILE_DESCRIPTION,
} from './constants';
import { readUtilsTemplateData } from './read-utils-template-data';
import { type UtilsCommandContext } from './types';
type HandlerPropsHandlerArgs = {
  readonly 'data-file': string;
  readonly 'root': string;
  readonly 'template': string;
};

type HandlerProps = HandlerArgs<HandlerPropsHandlerArgs>;

export const createUtilsTemplateRenderFileCommand = (
  ctx: UtilsCommandContext,
) => {
  const utilsTemplateRenderFileCommand = defineCommand({
    name: COMMAND_UTILS_TEMPLATE_RENDER_FILE,
    description: COMMAND_UTILS_TEMPLATE_RENDER_FILE_DESCRIPTION,
    options: {
      [`root`]: option(z.string().min(1), {
        description: `Template root directory`,
      }),
      [`template`]: option(z.string().min(1), {
        description: `Template path relative to the root`,
      }),
      [`data-file`]: option(z.string().min(1), {
        description: `JSON data file path`,
      }),
    },
    handler: async (props: HandlerProps) => {
      const { cwd, flags } = props;
      const dataResult = await readUtilsTemplateData(ctx, {
        cwd,
        filePath: flags[`data-file`],
      });

      if (dataResult.success === false) {
        return;
      }

      const root = resolveCLIInputPath({
        cwd,
        filePath: flags.root,
      });
      const { templateClient } = createTemplateClient({ root });
      const renderResult = await templateClient.renderFile(
        flags.template,
        dataResult.data,
      );

      if (renderResult.status === RESULT_STATUS_ERROR) {
        failCLIResultCommand(ctx, { error: renderResult.error });
        return;
      }

      writeCLIStdout(ctx, { data: renderResult.data });
    },
  });
  const result = { utilsTemplateRenderFileCommand };

  return result;
};
