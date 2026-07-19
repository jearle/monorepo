import { type ResultError } from '@jearle/util-result';
import { createErrorMessageWithCause } from '@jearle/util-error';

import {
  DEFAULT_HTTP_REQUEST_LABEL,
  HTTP_MIN_MAX_ATTEMPTS,
  HTTP_MIN_RESPONSE_BODY_SNIPPET_LENGTH,
  HTTP_MIN_RETRY_DELAY_MS,
  HTTP_MIN_RETRY_DELAY_MULTIPLIER,
  HTTP_MIN_TIMEOUT_MS,
  HTTP_STATUS_MAX,
  HTTP_STATUS_MIN,
} from '../constants';

export const HTTP_FAILED_TO_READ_RESPONSE_BODY_ERROR = `failed to read HTTP response body`;
export const HTTP_FAILED_TO_READ_RESPONSE_BODY_ERROR_CODE = `HTTP_RESPONSE_BODY_READ`;
export const HTTP_EMPTY_RESPONSE_BODY_ERROR = `HTTP response body is empty`;
export const HTTP_EMPTY_RESPONSE_BODY_ERROR_CODE = `HTTP_EMPTY_RESPONSE_BODY`;
export const HTTP_INVALID_JSON_ERROR = `invalid JSON response body`;
export const HTTP_INVALID_JSON_ERROR_CODE = `HTTP_INVALID_JSON`;
export const HTTP_INVALID_REQUEST_JSON_ERROR = `invalid JSON request body`;
export const HTTP_INVALID_REQUEST_JSON_ERROR_CODE = `HTTP_INVALID_REQUEST_JSON`;
export const HTTP_INVALID_MAX_ATTEMPTS_ERROR = `HTTP request maxAttempts must be an integer at least ${HTTP_MIN_MAX_ATTEMPTS}`;
export const HTTP_INVALID_MAX_RETRY_DELAY_MS_ERROR = `HTTP request maxRetryDelayMs must be at least retryDelayMs`;
export const HTTP_INVALID_RESPONSE_BODY_SNIPPET_LENGTH_ERROR = `HTTP responseBodySnippetLength must be an integer at least ${HTTP_MIN_RESPONSE_BODY_SNIPPET_LENGTH}`;
export const HTTP_INVALID_RETRY_DELAY_JITTER_ERROR = `HTTP request retryDelayJitter must be boolean`;
export const HTTP_INVALID_RETRY_DELAY_MS_ERROR = `HTTP request retryDelayMs must be at least ${HTTP_MIN_RETRY_DELAY_MS}`;
export const HTTP_INVALID_RETRY_DELAY_MULTIPLIER_ERROR = `HTTP request retryDelayMultiplier must be at least ${HTTP_MIN_RETRY_DELAY_MULTIPLIER}`;
export const HTTP_INVALID_RETRY_METHOD_ERROR = `HTTP retry method must be a non-empty string`;
export const HTTP_INVALID_RETRYABLE_STATUS_ERROR = `HTTP retryable status must be an integer between ${HTTP_STATUS_MIN} and ${HTTP_STATUS_MAX}`;
export const HTTP_INVALID_TIMEOUT_MS_ERROR = `HTTP request timeoutMs must be at least ${HTTP_MIN_TIMEOUT_MS} or false`;
export const HTTP_INVALID_BASE_URL_ERROR = `HTTP request baseUrl must be an absolute URL`;
export const HTTP_INVALID_OPTIONS_ERROR_CODE = `HTTP_INVALID_OPTIONS`;
export const HTTP_REQUEST_ABORTED_ERROR = `HTTP request aborted`;
export const HTTP_REQUEST_ABORTED_ERROR_CODE = `HTTP_REQUEST_ABORTED`;
export const HTTP_REQUEST_FAILED_ERROR_CODE = `HTTP_REQUEST_FAILED`;
export const HTTP_STATUS_ERROR_CODE = `HTTP_STATUS`;
export const HTTP_TIMEOUT_ERROR_CODE = `HTTP_TIMEOUT`;

export type HttpResultError = ResultError;

type CreateHttpResultErrorProps = {
  readonly code: string;
  readonly message: string;
};

const createHttpResultError = (props: CreateHttpResultErrorProps) => {
  const { code, message } = props;
  const resultError: ResultError = {
    message,
    code,
  };

  return resultError;
};

export type CreateHttpRequestFailedErrorMessageProps = {
  readonly cause: unknown;
  readonly requestLabel?: string;
};

export const createHttpRequestFailedErrorMessage = (
  props: CreateHttpRequestFailedErrorMessageProps,
) => {
  const { cause, requestLabel = DEFAULT_HTTP_REQUEST_LABEL } = props;
  const errorMessage = createErrorMessageWithCause({
    cause,
    prefix: `${requestLabel} failed`,
  });

  return errorMessage;
};

export type CreateHttpTimeoutErrorMessageProps = {
  readonly requestLabel?: string;
  readonly timeoutMs: number;
};

export const createHttpTimeoutErrorMessage = (
  props: CreateHttpTimeoutErrorMessageProps,
) => {
  const { requestLabel = DEFAULT_HTTP_REQUEST_LABEL, timeoutMs } = props;
  const errorMessage = `${requestLabel} timed out after ${timeoutMs}ms`;

  return errorMessage;
};

export type CreateHttpStatusErrorMessageProps = {
  readonly bodySnippet: string;
  readonly requestLabel?: string;
  readonly status: number;
  readonly statusText: string;
};

export const createHttpStatusErrorMessage = (
  props: CreateHttpStatusErrorMessageProps,
) => {
  const {
    bodySnippet,
    requestLabel = DEFAULT_HTTP_REQUEST_LABEL,
    status,
    statusText,
  } = props;
  const statusParts = [
    requestLabel,
    `failed with status`,
    String(status),
    statusText,
  ];
  const statusMessage = statusParts.join(` `).trim();

  if (bodySnippet.length === 0) {
    return statusMessage;
  }

  const errorMessage = `${statusMessage}. Response body: ${bodySnippet}`;

  return errorMessage;
};

export type CreateInvalidJsonErrorMessageProps = {
  readonly cause: unknown;
};

export const createInvalidJsonErrorMessage = (
  props: CreateInvalidJsonErrorMessageProps,
) => {
  const { cause } = props;
  const errorMessage = createErrorMessageWithCause({
    cause,
    prefix: HTTP_INVALID_JSON_ERROR,
  });

  return errorMessage;
};

export type CreateHttpTimeoutResultErrorProps = {
  readonly requestLabel?: string;
  readonly timeoutMs: number;
};

export const createHttpTimeoutResultError = (
  props: CreateHttpTimeoutResultErrorProps,
) => {
  const message = createHttpTimeoutErrorMessage(props);
  const resultError = createHttpResultError({
    message,
    code: HTTP_TIMEOUT_ERROR_CODE,
  });

  return resultError;
};

export type CreateHttpRequestFailedResultErrorProps = {
  readonly cause: unknown;
  readonly requestLabel?: string;
};

export const createHttpRequestFailedResultError = (
  props: CreateHttpRequestFailedResultErrorProps,
) => {
  const message = createHttpRequestFailedErrorMessage(props);
  const resultError = createHttpResultError({
    message,
    code: HTTP_REQUEST_FAILED_ERROR_CODE,
  });

  return resultError;
};

export type CreateHttpRequestAbortedResultErrorProps = {
  readonly cause: unknown;
};

export const createHttpRequestAbortedResultError = (
  props: CreateHttpRequestAbortedResultErrorProps,
) => {
  const { cause } = props;
  const message = createErrorMessageWithCause({
    cause,
    prefix: HTTP_REQUEST_ABORTED_ERROR,
  });
  const resultError = createHttpResultError({
    message,
    code: HTTP_REQUEST_ABORTED_ERROR_CODE,
  });

  return resultError;
};

export type CreateHttpRequestAbortedResultErrorFromSignalProps = {
  readonly signal?: AbortSignal;
};

export const createHttpRequestAbortedResultErrorFromSignal = (
  props: CreateHttpRequestAbortedResultErrorFromSignalProps,
): ResultError | null => {
  const { signal } = props;

  if (signal?.aborted !== true) {
    return null;
  }

  const resultError = createHttpRequestAbortedResultError({
    cause: signal.reason,
  });

  return resultError;
};

export type CreateHttpInvalidOptionsResultErrorProps = {
  readonly message: string;
};

export const createHttpInvalidOptionsResultError = (
  props: CreateHttpInvalidOptionsResultErrorProps,
) => {
  const { message } = props;
  const resultError = createHttpResultError({
    message,
    code: HTTP_INVALID_OPTIONS_ERROR_CODE,
  });

  return resultError;
};

export type CreateHttpStatusResultErrorProps = {
  readonly bodySnippet: string;
  readonly requestLabel?: string;
  readonly status: number;
  readonly statusText: string;
};

export const createHttpStatusResultError = (
  props: CreateHttpStatusResultErrorProps,
) => {
  const message = createHttpStatusErrorMessage(props);
  const resultError = createHttpResultError({
    message,
    code: HTTP_STATUS_ERROR_CODE,
  });

  return resultError;
};

export type CreateHttpInvalidJsonResultErrorProps = {
  readonly cause: unknown;
};

export const createHttpInvalidJsonResultError = (
  props: CreateHttpInvalidJsonResultErrorProps,
) => {
  const message = createInvalidJsonErrorMessage(props);
  const resultError = createHttpResultError({
    message,
    code: HTTP_INVALID_JSON_ERROR_CODE,
  });

  return resultError;
};

export type CreateHttpInvalidRequestJsonResultErrorProps = {
  readonly cause: unknown;
};

export const createHttpInvalidRequestJsonResultError = (
  props: CreateHttpInvalidRequestJsonResultErrorProps,
) => {
  const { cause } = props;
  const message = createErrorMessageWithCause({
    cause,
    prefix: HTTP_INVALID_REQUEST_JSON_ERROR,
  });
  const resultError = createHttpResultError({
    message,
    code: HTTP_INVALID_REQUEST_JSON_ERROR_CODE,
  });

  return resultError;
};

export const createHttpEmptyResponseBodyResultError = () => {
  const resultError = createHttpResultError({
    message: HTTP_EMPTY_RESPONSE_BODY_ERROR,
    code: HTTP_EMPTY_RESPONSE_BODY_ERROR_CODE,
  });

  return resultError;
};

export type CreateHttpResponseBodyReadResultErrorProps = {
  readonly cause: unknown;
};

export const createHttpResponseBodyReadResultError = (
  props: CreateHttpResponseBodyReadResultErrorProps,
) => {
  const { cause } = props;
  const message = createErrorMessageWithCause({
    cause,
    prefix: HTTP_FAILED_TO_READ_RESPONSE_BODY_ERROR,
  });
  const resultError = createHttpResultError({
    message,
    code: HTTP_FAILED_TO_READ_RESPONSE_BODY_ERROR_CODE,
  });

  return resultError;
};
