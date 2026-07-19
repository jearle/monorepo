import {
  RESULT_STATUS_ERROR,
  createResultSuccess,
  wrapResultError,
} from '@jearle/util-result';

import {
  type TemplateData,
  type TemplateRenderOptions,
  type TemplateRenderResult,
} from '../types';
import { createTemplateResultErrorFromLiquidFileRenderError } from './errors';
import { normalizeTemplateRenderOptions } from './normalize-template-render-options';
import { type TemplateClientContext } from './types';

export type RenderTemplateFileProps = {
  readonly data: TemplateData;
  readonly filePath: string;
  readonly options?: TemplateRenderOptions;
};

export const renderTemplateFile = async (
  ctx: TemplateClientContext,
  props: RenderTemplateFileProps,
): Promise<TemplateRenderResult> => {
  const { data, filePath, options } = props;

  if (ctx.liquid === null) {
    const result = wrapResultError({ error: ctx.optionsResult.error });

    return result;
  }

  const renderOptionsResult = normalizeTemplateRenderOptions({
    clientOptions: ctx.optionsResult.data,
    renderOptions: options,
  });

  if (renderOptionsResult.status === RESULT_STATUS_ERROR) {
    const result = wrapResultError({ error: renderOptionsResult.error });

    return result;
  }

  try {
    const output: unknown = await ctx.liquid.renderFile(
      filePath,
      data,
      renderOptionsResult.data,
    );
    const renderedTemplate = String(output);
    const result = createResultSuccess({ data: renderedTemplate });

    return result;
  } catch (error) {
    const resultError = createTemplateResultErrorFromLiquidFileRenderError({
      error,
    });
    const result = wrapResultError({ error: resultError });

    return result;
  }
};
