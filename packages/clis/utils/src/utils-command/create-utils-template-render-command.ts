import { type HandlerArgs, defineCommand, option } from '@bunli/core';
import { createTemplateClient } from '@jearle/util-template';
import { RESULT_STATUS_ERROR } from '@jearle/util-result';
import {
  failCLIResultCommand,
  readCLITextInput,
  writeCLIStdout,
} from '@jearle/util-cli';
import { z } from 'zod';

import {
  COMMAND_UTILS_TEMPLATE_RENDER,
  COMMAND_UTILS_TEMPLATE_RENDER_DESCRIPTION,
} from './constants';
import { readUtilsTemplateData } from './read-utils-template-data';
import { type UtilsCommandContext } from './types';
type HandlerPropsHandlerArgs = {
  readonly 'data-file': string;
  readonly 'template-file': string;
};

type HandlerProps = HandlerArgs<HandlerPropsHandlerArgs>;

export const createUtilsTemplateRenderCommand = (ctx: UtilsCommandContext) => {
  const utilsTemplateRenderCommand = defineCommand({
    name: COMMAND_UTILS_TEMPLATE_RENDER,
    description: COMMAND_UTILS_TEMPLATE_RENDER_DESCRIPTION,
    options: {
      [`template-file`]: option(z.string().min(1), {
        description: `Template file path`,
      }),
      [`data-file`]: option(z.string().min(1), {
        description: `JSON data file path`,
      }),
    },
    handler: async (props: HandlerProps) => {
      const { cwd, flags } = props;
      const templateResult = await readCLITextInput(ctx, {
        cwd,
        filePath: flags[`template-file`],
      });

      if (templateResult.success === false) {
        return;
      }

      const dataResult = await readUtilsTemplateData(ctx, {
        cwd,
        filePath: flags[`data-file`],
      });

      if (dataResult.success === false) {
        return;
      }

      const { templateClient } = createTemplateClient();
      const renderResult = await templateClient.render(
        templateResult.data,
        dataResult.data,
      );

      if (renderResult.status === RESULT_STATUS_ERROR) {
        failCLIResultCommand(ctx, { error: renderResult.error });
        return;
      }

      writeCLIStdout(ctx, { data: renderResult.data });
    },
  });
  const result = { utilsTemplateRenderCommand };

  return result;
};
