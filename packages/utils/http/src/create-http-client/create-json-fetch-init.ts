import { safeStringify } from '@jearle/util-json';
import {
  type Result,
  createResultSuccess,
  wrapResultError,
} from '@jearle/util-result';

import { HTTP_CONTENT_TYPE_JSON, HTTP_HEADER_CONTENT_TYPE } from '../constants';
import { createHttpInvalidRequestJsonResultError } from '../errors';
import { type HttpFetchInit, type HttpJsonFetchInit } from '../types';

type CreateJsonHeadersProps = {
  readonly clientHeaders: HeadersInit | undefined;
  readonly initHeaders: HeadersInit | undefined;
};

const createJsonHeaders = (props: CreateJsonHeadersProps) => {
  const { clientHeaders, initHeaders } = props;
  const headers = new Headers(initHeaders);
  const clientHeaderValues = new Headers(clientHeaders);
  const hasContentType =
    headers.has(HTTP_HEADER_CONTENT_TYPE) ||
    clientHeaderValues.has(HTTP_HEADER_CONTENT_TYPE);

  if (hasContentType) {
    return initHeaders;
  }

  headers.set(HTTP_HEADER_CONTENT_TYPE, HTTP_CONTENT_TYPE_JSON);

  return headers;
};

export type CreateJsonFetchInitProps = {
  readonly clientHeaders: HeadersInit | undefined;
  readonly init: HttpJsonFetchInit | undefined;
};

export const createJsonFetchInit = (
  props: CreateJsonFetchInitProps,
): Result<HttpFetchInit> => {
  const { clientHeaders, init } = props;
  const { json, ...fetchInit } = init ?? {};

  if (json === undefined) {
    const result = createResultSuccess({ data: init });

    return result;
  }

  const stringifyResult = safeStringify(json);

  if (stringifyResult.success === false) {
    const error = createHttpInvalidRequestJsonResultError({
      cause: stringifyResult.error,
    });
    const result = wrapResultError({ error });

    return result;
  }

  const headers = createJsonHeaders({
    clientHeaders,
    initHeaders: init?.headers,
  });
  const data: HttpFetchInit = {
    ...fetchInit,
    body: stringifyResult.data,
    headers,
  };
  const result = createResultSuccess({ data });

  return result;
};
