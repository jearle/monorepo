import { type Template } from 'liquidjs';
import { createResultSuccess, wrapResultError } from '@jearle/util-result';

import {
  createTemplateAnalyzeResultError,
  createTemplateParseResultError,
} from '../errors';
import { type TemplateAnalysis, type TemplateAnalyzeResult } from '../types';
import { type TemplateClientContext } from './types';

export type AnalyzeTemplateProps = {
  readonly template: string;
};

export const analyzeTemplate = (
  ctx: TemplateClientContext,
  props: AnalyzeTemplateProps,
): TemplateAnalyzeResult => {
  const { template } = props;

  if (ctx.liquid === null) {
    const result = wrapResultError({ error: ctx.optionsResult.error });

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
    const variables = ctx.liquid.globalFullVariablesSync(parsedTemplate, {
      partials: false,
    });
    const uniqueVariables = Array.from(new Set(variables));
    const sortedVariables = uniqueVariables.toSorted();
    const analysis: TemplateAnalysis = {
      variables: sortedVariables,
    };
    const result = createResultSuccess({ data: analysis });

    return result;
  } catch {
    const resultError = createTemplateAnalyzeResultError();
    const result = wrapResultError({ error: resultError });

    return result;
  }
};
