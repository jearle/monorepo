import { type Template, Parser } from 'liquidjs';
import { createResultSuccess, wrapResultError } from '@jearle/util-result';

import {
  TEMPLATE_PARSE_ERROR_CODE,
  TEMPLATE_SOURCE_ERROR,
  TEMPLATE_SOURCE_ERROR_CODE,
  TEMPLATE_SOURCE_PARSE_AT_ERROR,
  createSourceTemplateResultError,
} from '../errors';
import { type TemplateParseOptions, type TemplateParseResult } from '../types';
import { checkIsLiquidParseError } from './check-is-liquid-parse-error';
import { getSourceTemplateFailure } from './errors';
import { findSourceTemplateImports } from './find-source-template-imports';
import { parseStaticTemplateImports } from './parse-static-template-imports';
import { type TemplateClientContext } from './types';

const TEMPLATE_CLIENT_SOURCE_LABEL = `template-client`;

const findTemplateFilePath = (templates: readonly Template[]) =>
  templates.find(({ token }) => typeof token.file === `string`)?.token.file;

export type ParseTemplateProps = {
  readonly options?: TemplateParseOptions;
  readonly template: string;
};

export const parseTemplate = async (
  ctx: TemplateClientContext,
  props: ParseTemplateProps,
): Promise<TemplateParseResult> => {
  if (ctx.liquid === null) {
    const result = wrapResultError({ error: ctx.optionsResult.error });

    return result;
  }

  const options = ctx.optionsResult.data;

  try {
    const parser = new Parser(ctx.liquid);
    const templates = parser.parse(props.template);
    const hasFileImports = findSourceTemplateImports(templates).length > 0;

    if (props.options?.resolveStaticImports === false) {
      const result = createResultSuccess({ data: { hasFileImports } });

      return result;
    }

    const state = await parseStaticTemplateImports({
      extname: options.extname ?? ``,
      parser,
      resolveTarget: ({
        currentFilePath,
        importedTemplates,
        lookupType,
        request,
      }) => {
        const targetFilePath = findTemplateFilePath(importedTemplates);
        const identity =
          targetFilePath ??
          `${lookupType}:${currentFilePath ?? TEMPLATE_CLIENT_SOURCE_LABEL}:${request}`;
        const result = {
          ...(targetFilePath === undefined ? {} : { filePath: targetFilePath }),
          identity,
        };

        return result;
      },
      sourceLabel: TEMPLATE_CLIENT_SOURCE_LABEL,
      templateLimit: options.templateLimit,
      templates,
    });
    const result = createResultSuccess({
      data: { hasFileImports: state.hasFileImports },
    });

    return result;
  } catch (error) {
    const sourceFailure = getSourceTemplateFailure(error);
    const isParseError = checkIsLiquidParseError(error);
    const failure = sourceFailure ?? {
      code: isParseError
        ? TEMPLATE_PARSE_ERROR_CODE
        : TEMPLATE_SOURCE_ERROR_CODE,
      message: isParseError
        ? `${TEMPLATE_SOURCE_PARSE_AT_ERROR} ${TEMPLATE_CLIENT_SOURCE_LABEL}`
        : TEMPLATE_SOURCE_ERROR,
    };
    const resultError = createSourceTemplateResultError(failure);
    const result = wrapResultError({ error: resultError });

    return result;
  }
};
