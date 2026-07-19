import path from 'node:path';

import {
  RESULT_STATUS_ERROR,
  createResultSuccess,
  wrapResultError,
} from '@jearle/util-result';

import {
  TEMPLATE_SOURCE_GRAPH_LIMIT_ERROR,
  TEMPLATE_SOURCE_LIMIT_ERROR_CODE,
  createSourceTemplateResultError,
} from '../errors';
import {
  type SourceTemplate,
  type TemplateData,
  type TemplateRenderOptions,
  type TemplateRenderResult,
} from '../types';
import {
  createSourceTemplateFailure,
  createTemplateResultErrorFromLiquidRenderError,
  getSourceTemplateFailure,
} from './errors';
import { canonicalizeSourcePath } from './canonicalize-source-path';
import { createSourceTemplateLiquid } from './create-source-template-liquid';
import { normalizeTemplateRenderOptions } from './normalize-template-render-options';
import { type TemplateClientContext } from './types';

export type RenderSourceTemplateProps = {
  readonly data: TemplateData;
  readonly options?: TemplateRenderOptions;
  readonly source: SourceTemplate;
};

export const renderSourceTemplate = async (
  ctx: TemplateClientContext,
  props: RenderSourceTemplateProps,
): Promise<TemplateRenderResult> => {
  const { data, options, source } = props;
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
    if (
      source.template.length > ctx.optionsResult.data.parseLimit ||
      renderOptionsResult.data.templateLimit < 1
    ) {
      throw createSourceTemplateFailure(
        TEMPLATE_SOURCE_GRAPH_LIMIT_ERROR,
        TEMPLATE_SOURCE_LIMIT_ERROR_CODE,
      );
    }

    const canonicalPath = canonicalizeSourcePath(source.sourcePath);
    const operation = createSourceTemplateLiquid({
      extname: source.extname ?? ctx.optionsResult.data.extname ?? ``,
      importRoots: source.importRoots,
      options: ctx.optionsResult.data,
      sourceDirectoryPath: path.dirname(canonicalPath),
    });

    operation.resetLimits({
      parsedCharacters: source.template.length,
      templateLimit: renderOptionsResult.data.templateLimit,
    });
    const templates = operation.liquid.parse(source.template, canonicalPath);
    const output: unknown = await operation.liquid.render(
      templates,
      data,
      renderOptionsResult.data,
    );

    const result = createResultSuccess({ data: String(output) });

    return result;
  } catch (error) {
    const failure = getSourceTemplateFailure(error);
    const resultError =
      failure === null
        ? createTemplateResultErrorFromLiquidRenderError({ error })
        : createSourceTemplateResultError(failure);

    const result = wrapResultError({ error: resultError });

    return result;
  }
};
