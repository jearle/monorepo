import {
  type Result,
  RESULT_STATUS_ERROR,
  createResultSuccess,
  wrapResultError,
} from '@jearle/util-result';

import {
  DEFAULT_HTTP_MAX_ATTEMPTS,
  DEFAULT_HTTP_MAX_RETRY_DELAY_MS,
  DEFAULT_HTTP_REQUEST_LABEL,
  DEFAULT_HTTP_RETRYABLE_STATUSES,
  DEFAULT_HTTP_RETRY_DELAY_JITTER,
  DEFAULT_HTTP_RETRY_DELAY_MS,
  DEFAULT_HTTP_RETRY_DELAY_MULTIPLIER,
  DEFAULT_HTTP_RETRY_METHODS,
  DEFAULT_HTTP_TIMEOUT_MS,
  HTTP_MIN_MAX_ATTEMPTS,
  HTTP_MIN_RESPONSE_BODY_SNIPPET_LENGTH,
  HTTP_MIN_RETRY_DELAY_MS,
  HTTP_MIN_RETRY_DELAY_MULTIPLIER,
  HTTP_MIN_TIMEOUT_MS,
  HTTP_RESPONSE_BODY_SNIPPET_LENGTH,
  HTTP_STATUS_MAX,
  HTTP_STATUS_MIN,
} from '../constants';
import {
  HTTP_INVALID_BASE_URL_ERROR,
  HTTP_INVALID_MAX_ATTEMPTS_ERROR,
  HTTP_INVALID_MAX_RETRY_DELAY_MS_ERROR,
  HTTP_INVALID_RESPONSE_BODY_SNIPPET_LENGTH_ERROR,
  HTTP_INVALID_RETRYABLE_STATUS_ERROR,
  HTTP_INVALID_RETRY_DELAY_JITTER_ERROR,
  HTTP_INVALID_RETRY_DELAY_MS_ERROR,
  HTTP_INVALID_RETRY_DELAY_MULTIPLIER_ERROR,
  HTTP_INVALID_RETRY_METHOD_ERROR,
  HTTP_INVALID_TIMEOUT_MS_ERROR,
  createHttpInvalidOptionsResultError,
} from '../errors';
import { type CreateHttpClientProps } from '../types';
import { checkIsAbsoluteUrl } from './check-is-absolute-url';
import {
  type NormalizeHttpClientOptionsResult,
  type NormalizedHttpClientOptions,
} from './types';

const normalizeBaseUrl = (
  baseUrl: string | undefined,
): Result<string | undefined> => {
  if (baseUrl === undefined) {
    const result = createResultSuccess({ data: undefined });

    return result;
  }

  const isAbsoluteUrl = checkIsAbsoluteUrl(baseUrl);

  if (isAbsoluteUrl === false) {
    const error = createHttpInvalidOptionsResultError({
      message: HTTP_INVALID_BASE_URL_ERROR,
    });
    const result = wrapResultError({ error });

    return result;
  }

  const normalizedBaseUrl = baseUrl.endsWith(`/`) ? baseUrl : `${baseUrl}/`;
  const result = createResultSuccess({ data: normalizedBaseUrl });

  return result;
};

const getInvalidRetryableStatus = (statuses: readonly number[]) => {
  const invalidStatus = statuses.find((status) => {
    const isInteger = Number.isInteger(status);
    const isInHttpRange =
      status >= HTTP_STATUS_MIN && status <= HTTP_STATUS_MAX;

    return isInteger === false || isInHttpRange === false;
  });

  return invalidStatus;
};

const getInvalidRetryMethod = (retryMethods: readonly string[]) => {
  const invalidMethod = retryMethods.find((method) => {
    const isInvalidMethod = typeof method !== `string` || method.length === 0;

    return isInvalidMethod;
  });

  return invalidMethod;
};

export const normalizeHttpClientOptions = (
  props: CreateHttpClientProps,
): NormalizeHttpClientOptionsResult => {
  const {
    baseUrl: baseUrlInput,
    fetch,
    headers,
    hooks,
    maxAttempts = DEFAULT_HTTP_MAX_ATTEMPTS,
    requestLabel = DEFAULT_HTTP_REQUEST_LABEL,
    responseBodySnippetLength = HTTP_RESPONSE_BODY_SNIPPET_LENGTH,
    retryDelayJitter = DEFAULT_HTTP_RETRY_DELAY_JITTER,
    retryableStatuses = DEFAULT_HTTP_RETRYABLE_STATUSES,
    retryDelayMs = DEFAULT_HTTP_RETRY_DELAY_MS,
    maxRetryDelayMs = Math.max(DEFAULT_HTTP_MAX_RETRY_DELAY_MS, retryDelayMs),
    retryDelayMultiplier = DEFAULT_HTTP_RETRY_DELAY_MULTIPLIER,
    retryMethods = DEFAULT_HTTP_RETRY_METHODS,
    timeoutMs = DEFAULT_HTTP_TIMEOUT_MS,
  } = props;
  const baseUrlResult = normalizeBaseUrl(baseUrlInput);

  if (baseUrlResult.status === RESULT_STATUS_ERROR) {
    const result = wrapResultError({ error: baseUrlResult.error });

    return result;
  }

  const isValidMaxAttempts =
    Number.isInteger(maxAttempts) && maxAttempts >= HTTP_MIN_MAX_ATTEMPTS;
  const isValidRetryDelayMs =
    Number.isFinite(retryDelayMs) && retryDelayMs >= HTTP_MIN_RETRY_DELAY_MS;
  const isValidRetryDelayMultiplier =
    Number.isFinite(retryDelayMultiplier) &&
    retryDelayMultiplier >= HTTP_MIN_RETRY_DELAY_MULTIPLIER;
  const isValidMaxRetryDelayMs =
    Number.isFinite(maxRetryDelayMs) && maxRetryDelayMs >= retryDelayMs;
  const isValidRetryDelayJitter = typeof retryDelayJitter === `boolean`;
  const isValidTimeoutMs =
    timeoutMs === false ||
    (Number.isFinite(timeoutMs) && timeoutMs >= HTTP_MIN_TIMEOUT_MS);
  const isValidResponseBodySnippetLength =
    Number.isInteger(responseBodySnippetLength) &&
    responseBodySnippetLength >= HTTP_MIN_RESPONSE_BODY_SNIPPET_LENGTH;
  const invalidRetryableStatus = getInvalidRetryableStatus(retryableStatuses);
  const invalidRetryMethod = getInvalidRetryMethod(retryMethods);

  if (isValidMaxAttempts === false) {
    const error = createHttpInvalidOptionsResultError({
      message: HTTP_INVALID_MAX_ATTEMPTS_ERROR,
    });
    const result = wrapResultError({ error });

    return result;
  }

  if (isValidRetryDelayMs === false) {
    const error = createHttpInvalidOptionsResultError({
      message: HTTP_INVALID_RETRY_DELAY_MS_ERROR,
    });
    const result = wrapResultError({ error });

    return result;
  }

  if (isValidRetryDelayMultiplier === false) {
    const error = createHttpInvalidOptionsResultError({
      message: HTTP_INVALID_RETRY_DELAY_MULTIPLIER_ERROR,
    });
    const result = wrapResultError({ error });

    return result;
  }

  if (isValidMaxRetryDelayMs === false) {
    const error = createHttpInvalidOptionsResultError({
      message: HTTP_INVALID_MAX_RETRY_DELAY_MS_ERROR,
    });
    const result = wrapResultError({ error });

    return result;
  }

  if (isValidRetryDelayJitter === false) {
    const error = createHttpInvalidOptionsResultError({
      message: HTTP_INVALID_RETRY_DELAY_JITTER_ERROR,
    });
    const result = wrapResultError({ error });

    return result;
  }

  if (isValidTimeoutMs === false) {
    const error = createHttpInvalidOptionsResultError({
      message: HTTP_INVALID_TIMEOUT_MS_ERROR,
    });
    const result = wrapResultError({ error });

    return result;
  }

  if (isValidResponseBodySnippetLength === false) {
    const error = createHttpInvalidOptionsResultError({
      message: HTTP_INVALID_RESPONSE_BODY_SNIPPET_LENGTH_ERROR,
    });
    const result = wrapResultError({ error });

    return result;
  }

  if (invalidRetryableStatus !== undefined) {
    const message = `${HTTP_INVALID_RETRYABLE_STATUS_ERROR}. Got: ${invalidRetryableStatus}`;
    const error = createHttpInvalidOptionsResultError({ message });
    const result = wrapResultError({ error });

    return result;
  }

  if (invalidRetryMethod !== undefined) {
    const message = `${HTTP_INVALID_RETRY_METHOD_ERROR}. Got: ${String(
      invalidRetryMethod,
    )}`;
    const error = createHttpInvalidOptionsResultError({ message });
    const result = wrapResultError({ error });

    return result;
  }

  const data: NormalizedHttpClientOptions = {
    baseUrl: baseUrlResult.data,
    fetch,
    headers,
    hooks,
    maxAttempts,
    maxRetryDelayMs,
    requestLabel,
    responseBodySnippetLength,
    retryDelayJitter,
    retryDelayMs,
    retryDelayMultiplier,
    retryMethods,
    retryableStatuses,
    timeoutMs,
  };
  const result = createResultSuccess({ data });

  return result;
};
