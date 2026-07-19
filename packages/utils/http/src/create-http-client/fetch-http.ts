import { createResultSuccess, wrapResultError } from '@jearle/util-result';

import { createHttpRequestAbortedResultErrorFromSignal } from '../errors';
import { type HttpFetchInit, type HttpFetchInput } from '../types';
import { createHttpResultFromKyError } from './errors';
import { resolveHttpInput } from './resolve-http-input';
import { type FetchHttpResult, type HttpClientContext } from './types';

export const fetchHttp = async (
  ctx: HttpClientContext,
  input: HttpFetchInput,
  init?: HttpFetchInit,
): Promise<FetchHttpResult> => {
  if (ctx.kyInstance === null) {
    const result = wrapResultError({
      error: ctx.optionsResult.error,
    });

    return result;
  }

  const signal = init?.signal ?? undefined;
  const abortedError = createHttpRequestAbortedResultErrorFromSignal({
    signal,
  });

  if (abortedError !== null) {
    const result = wrapResultError({ error: abortedError });

    return result;
  }

  const options = ctx.optionsResult.data;
  const kyInput = resolveHttpInput(input, options.baseUrl);

  try {
    const response = await ctx.kyInstance(kyInput, init);
    const result = createResultSuccess({ data: response });

    return result;
  } catch (error) {
    const result = createHttpResultFromKyError({
      error,
      options,
      signal,
    });

    return result;
  }
};
