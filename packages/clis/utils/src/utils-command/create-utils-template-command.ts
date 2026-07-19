import { defineGroup } from '@bunli/core';

import {
  COMMAND_UTILS_TEMPLATE,
  COMMAND_UTILS_TEMPLATE_DESCRIPTION,
} from './constants';
import { createUtilsTemplateAnalyzeCommand } from './create-utils-template-analyze-command';
import { createUtilsTemplateRenderCommand } from './create-utils-template-render-command';
import { createUtilsTemplateRenderFileCommand } from './create-utils-template-render-file-command';
import { type UtilsCommandContext } from './types';

export const createUtilsTemplateCommand = (ctx: UtilsCommandContext) => {
  const { utilsTemplateRenderCommand } = createUtilsTemplateRenderCommand(ctx);
  const { utilsTemplateRenderFileCommand } =
    createUtilsTemplateRenderFileCommand(ctx);
  const { utilsTemplateAnalyzeCommand } =
    createUtilsTemplateAnalyzeCommand(ctx);
  const utilsTemplateCommand = defineGroup({
    name: COMMAND_UTILS_TEMPLATE,
    description: COMMAND_UTILS_TEMPLATE_DESCRIPTION,
    commands: [
      utilsTemplateRenderCommand,
      utilsTemplateRenderFileCommand,
      utilsTemplateAnalyzeCommand,
    ],
  });
  const result = { utilsTemplateCommand };

  return result;
};
