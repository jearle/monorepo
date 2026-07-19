import { type Template } from 'liquidjs';
import {
  RESULT_STATUS_ERROR,
  createResultSuccess,
  wrapResultError,
} from '@jearle/util-result';

import { createTemplateParseResultError } from '../errors';
import {
  type TemplateData,
  type TemplateRenderOptions,
  type TemplateRenderResult,
} from '../types';
import { createTemplateResultErrorFromLiquidRenderError } from './errors';
import { normalizeTemplateRenderOptions } from './normalize-template-render-options';
import { type TemplateClientContext } from './types';

export type RenderTemplateProps = {
  readonly data: TemplateData;
  readonly options?: TemplateRenderOptions;
  readonly template: string;
};

export const renderTemplate = async (
  ctx: TemplateClientContext,
  props: RenderTemplateProps,
): Promise<TemplateRenderResult> => {
  const { data, options, template } = props;

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

  let parsedTemplate: Template[];

  try {
    parsedTemplate = ctx.liquid.parse(template);
  } catch {
    const resultError = createTemplateParseResultError();
    const result = wrapResultError({ error: resultError });

    return result;
  }

  try {
    const output: unknown = await ctx.liquid.render(
      parsedTemplate,
      data,
      renderOptionsResult.data,
    );
    const renderedTemplate = String(output);
    const result = createResultSuccess({ data: renderedTemplate });

    return result;
  } catch (error) {
    const resultError = createTemplateResultErrorFromLiquidRenderError({
      error,
    });
    const result = wrapResultError({ error: resultError });

    return result;
  }
};
