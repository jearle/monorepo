import { RESULT_STATUS_ERROR, createResultSuccess } from '@jearle/util-result';

import { type SourceTemplate, type TemplateParseResult } from '../types';
import { analyzeSourceTemplateDependencies } from './analyze-source-template-dependencies';
import { type TemplateClientContext } from './types';

export type ParseSourceTemplateProps = {
  readonly source: SourceTemplate;
};

export const parseSourceTemplate = async (
  ctx: TemplateClientContext,
  props: ParseSourceTemplateProps,
): Promise<TemplateParseResult> => {
  const { source } = props;
  const analysisResult = await analyzeSourceTemplateDependencies(ctx, {
    source,
  });

  if (analysisResult.status === RESULT_STATUS_ERROR) {
    return analysisResult;
  }

  const hasStaticFileImports = analysisResult.data.staticImportPaths.length > 0;
  const hasFileImports =
    analysisResult.data.hasDynamicFileImports || hasStaticFileImports;
  const result = createResultSuccess({ data: { hasFileImports } });

  return result;
};
