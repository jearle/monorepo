import {
  RESULT_STATUS_ERROR,
  createResultSuccess,
  wrapResultError,
} from '@jearle/util-result';

import {
  type HttpFetchInput,
  type HttpJsonFetchInit,
  type HttpJsonResponse,
} from '../types';
import { createHttpStatusResultErrorFromResponse } from './errors';
import { createJsonFetchInit } from './create-json-fetch-init';
import { fetchHttp } from './fetch-http';
import { readJsonResponse } from './read-json-response';
import { type FetchJsonResult, type HttpClientContext } from './types';

export const fetchJson = async <TJson = unknown>(
  ctx: HttpClientContext,
  input: HttpFetchInput,
  init?: HttpJsonFetchInit,
): Promise<FetchJsonResult<TJson>> => {
  if (ctx.optionsResult.status === RESULT_STATUS_ERROR) {
    const result = wrapResultError({
      error: ctx.optionsResult.error,
    });

    return result;
  }

  const fetchInitResult = createJsonFetchInit({
    clientHeaders: ctx.optionsResult.data.headers,
    init,
  });

  if (fetchInitResult.status === RESULT_STATUS_ERROR) {
    const result = wrapResultError({
      error: fetchInitResult.error,
    });

    return result;
  }

  const responseResult = await fetchHttp(ctx, input, fetchInitResult.data);

  if (responseResult.status === RESULT_STATUS_ERROR) {
    const result = wrapResultError({
      error: responseResult.error,
    });

    return result;
  }

  const response = responseResult.data;

  if (response.ok === false) {
    const error = await createHttpStatusResultErrorFromResponse({
      requestLabel: ctx.optionsResult.data.requestLabel,
      response,
      responseBodySnippetLength:
        ctx.optionsResult.data.responseBodySnippetLength,
    });
    const result = wrapResultError({ error });

    return result;
  }

  const jsonResult = await readJsonResponse<TJson>(response);

  if (jsonResult.status === RESULT_STATUS_ERROR) {
    const result = wrapResultError({
      error: jsonResult.error,
    });

    return result;
  }

  const data: HttpJsonResponse<TJson> = {
    json: jsonResult.data,
    response,
  };
  const result = createResultSuccess({ data });

  return result;
};
