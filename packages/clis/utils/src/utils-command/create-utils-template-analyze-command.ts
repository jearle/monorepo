import { type HandlerArgs, defineCommand, option } from '@bunli/core';
import {
  failCLIResultCommand,
  readCLITextInput,
  writeCLIJSONOutput,
} from '@jearle/util-cli';
import { RESULT_STATUS_ERROR } from '@jearle/util-result';
import { createTemplateClient } from '@jearle/util-template';
import { z } from 'zod';

import {
  COMMAND_UTILS_TEMPLATE_ANALYZE,
  COMMAND_UTILS_TEMPLATE_ANALYZE_DESCRIPTION,
} from './constants';
import { type UtilsCommandContext } from './types';
type HandlerPropsHandlerArgs = {
  readonly 'template-file': string;
};

type HandlerProps = HandlerArgs<HandlerPropsHandlerArgs>;

export const createUtilsTemplateAnalyzeCommand = (ctx: UtilsCommandContext) => {
  const utilsTemplateAnalyzeCommand = defineCommand({
    name: COMMAND_UTILS_TEMPLATE_ANALYZE,
    description: COMMAND_UTILS_TEMPLATE_ANALYZE_DESCRIPTION,
    options: {
      [`template-file`]: option(z.string().min(1), {
        description: `Template file path`,
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

      const { templateClient } = createTemplateClient();
      const analyzeResult = templateClient.analyze(templateResult.data);

      if (analyzeResult.status === RESULT_STATUS_ERROR) {
        failCLIResultCommand(ctx, { error: analyzeResult.error });
        return;
      }

      writeCLIJSONOutput(ctx, { data: analyzeResult.data });
    },
  });
  const result = { utilsTemplateAnalyzeCommand };

  return result;
};
