import { isTimeoutError as checkIsTimeoutError } from 'ky';
import {
  type Result,
  type ResultError,
  wrapResultError,
} from '@jearle/util-result';

import {
  createHttpRequestAbortedResultErrorFromSignal,
  createHttpRequestFailedResultError,
  createHttpResponseBodyReadResultError,
  createHttpStatusResultError,
  createHttpTimeoutResultError,
} from '../errors';
import { type NormalizedHttpClientOptions } from './types';

export type CreateHttpResultFromKyErrorProps = {
  readonly error: unknown;
  readonly options: NormalizedHttpClientOptions;
  readonly signal?: AbortSignal;
};

export const createHttpResultFromKyError = (
  props: CreateHttpResultFromKyErrorProps,
): Result<Response> => {
  const { error, options, signal } = props;
  const abortedError = createHttpRequestAbortedResultErrorFromSignal({
    signal,
  });

  if (abortedError !== null) {
    const result = wrapResultError({ error: abortedError });

    return result;
  }

  const isTimeoutError = checkIsTimeoutError(error);
  const shouldCreateTimeoutError =
    isTimeoutError && options.timeoutMs !== false;

  if (shouldCreateTimeoutError) {
    const resultError = createHttpTimeoutResultError({
      requestLabel: options.requestLabel,
      timeoutMs: options.timeoutMs,
    });
    const result = wrapResultError({ error: resultError });

    return result;
  }

  const failedError = createHttpRequestFailedResultError({
    cause: error,
    requestLabel: options.requestLabel,
  });
  const result = wrapResultError({ error: failedError });

  return result;
};

type ReadResponseBodySnippetProps = {
  readonly response: Response;
  readonly responseBodySnippetLength: number;
};

const readResponseBodySnippet = async (props: ReadResponseBodySnippetProps) => {
  const { response, responseBodySnippetLength } = props;

  if (responseBodySnippetLength === 0) {
    return ``;
  }

  try {
    const body = await response.clone().text();
    const result = body.slice(0, responseBodySnippetLength);

    return result;
  } catch (cause) {
    const error = createHttpResponseBodyReadResultError({ cause });
    const result = `body unavailable: ${error.message}`;

    return result;
  }
};

export type CreateHttpStatusResultErrorFromResponseProps = {
  readonly requestLabel: string;
  readonly response: Response;
  readonly responseBodySnippetLength: number;
};

export const createHttpStatusResultErrorFromResponse = async (
  props: CreateHttpStatusResultErrorFromResponseProps,
): Promise<ResultError> => {
  const { requestLabel, response, responseBodySnippetLength } = props;
  const bodySnippet = await readResponseBodySnippet({
    response,
    responseBodySnippetLength,
  });
  const result = createHttpStatusResultError({
    bodySnippet,
    requestLabel,
    status: response.status,
    statusText: response.statusText,
  });

  return result;
};
