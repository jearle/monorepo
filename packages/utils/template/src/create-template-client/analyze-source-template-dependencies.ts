import path from 'node:path';

import { Parser } from 'liquidjs';
import { createResultSuccess, wrapResultError } from '@jearle/util-result';

import {
  TEMPLATE_PARSE_ERROR_CODE,
  TEMPLATE_SOURCE_ERROR,
  TEMPLATE_SOURCE_ERROR_CODE,
  TEMPLATE_SOURCE_PARSE_AT_ERROR,
  createSourceTemplateResultError,
} from '../errors';
import {
  type SourceTemplate,
  type SourceTemplateDependencyAnalysisResult,
} from '../types';
import { canonicalizeSourcePath } from './canonicalize-source-path';
import { checkIsLiquidParseError } from './check-is-liquid-parse-error';
import { createSourceTemplateLiquid } from './create-source-template-liquid';
import { getSourceTemplateFailure } from './errors';
import { parseStaticTemplateImports } from './parse-static-template-imports';
import { type TemplateClientContext } from './types';

export type AnalyzeSourceTemplateDependenciesProps = {
  readonly source: SourceTemplate;
};

export const analyzeSourceTemplateDependencies = async (
  ctx: TemplateClientContext,
  props: AnalyzeSourceTemplateDependenciesProps,
): Promise<SourceTemplateDependencyAnalysisResult> => {
  const { source } = props;
  const sourceLabel = path.basename(source.sourcePath);

  if (ctx.liquid === null) {
    const result = wrapResultError({ error: ctx.optionsResult.error });

    return result;
  }

  try {
    const canonicalPath = canonicalizeSourcePath(source.sourcePath);
    const extname = source.extname ?? ctx.optionsResult.data.extname ?? ``;
    const operation = createSourceTemplateLiquid({
      extname,
      importRoots: source.importRoots,
      options: ctx.optionsResult.data,
      sourceDirectoryPath: path.dirname(canonicalPath),
    });
    const parser = new Parser(operation.liquid);

    operation.resetLimits({
      parsedCharacters: source.template.length,
      templateLimit: ctx.optionsResult.data.templateLimit,
    });
    const templates = parser.parse(source.template, canonicalPath);
    const importAnalysis = await parseStaticTemplateImports({
      beforeImport: operation.clearLastReadPath,
      currentFilePath: canonicalPath,
      extname,
      initialIdentity: canonicalPath,
      parser,
      resolveTarget: () => {
        const targetPath = operation.getLastReadPath();
        const result =
          targetPath === null
            ? null
            : { filePath: targetPath, identity: targetPath };

        return result;
      },
      sourceLabel,
      templateLimit: ctx.optionsResult.data.templateLimit,
      templates,
    });
    const analysis = {
      hasDynamicFileImports: importAnalysis.hasDynamicFileImports,
      staticImportPaths: importAnalysis.staticImportPaths,
    };
    const result = createResultSuccess({ data: analysis });

    return result;
  } catch (error) {
    const sourceFailure = getSourceTemplateFailure(error);
    const isParseError = checkIsLiquidParseError(error);
    const failure = sourceFailure ?? {
      code: isParseError
        ? TEMPLATE_PARSE_ERROR_CODE
        : TEMPLATE_SOURCE_ERROR_CODE,
      message: isParseError
        ? `${TEMPLATE_SOURCE_PARSE_AT_ERROR} ${sourceLabel}`
        : TEMPLATE_SOURCE_ERROR,
    };
    const resultError = createSourceTemplateResultError(failure);
    const result = wrapResultError({ error: resultError });

    return result;
  }
};
