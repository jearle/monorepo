import { expect, test } from 'bun:test';
import {
  type Result,
  type ResultError,
  RESULT_STATUS_ERROR,
  RESULT_STATUS_SUCCESS,
} from '@jearle/util-result';

import { createHttpClient } from '.';
import {
  type HttpFetch,
  HTTP_CONTENT_TYPE_JSON,
  HTTP_HEADER_CONTENT_TYPE,
  HTTP_INVALID_JSON_ERROR_CODE,
  HTTP_INVALID_OPTIONS_ERROR_CODE,
  HTTP_INVALID_REQUEST_JSON_ERROR_CODE,
  HTTP_METHOD_POST,
  HTTP_REQUEST_ABORTED_ERROR_CODE,
  HTTP_REQUEST_FAILED_ERROR_CODE,
  HTTP_STATUS_ERROR_CODE,
  HTTP_TIMEOUT_ERROR_CODE,
} from '..';

const HTTP_HEADER_TEST_DEFAULT = `x-default`;
const HTTP_HEADER_TEST_REQUEST = `x-request`;

type ExpectSuccessResultProps<TData> = {
  readonly result: Result<TData>;
};

const expectSuccessResult = <TData>(props: ExpectSuccessResultProps<TData>) => {
  const { result } = props;

  expect(result.status).toBe(RESULT_STATUS_SUCCESS);

  if (result.status !== RESULT_STATUS_SUCCESS) {
    expect.unreachable();
  }

  return result.data;
};

type ExpectErrorResultProps<TData> = {
  readonly result: Result<TData>;
};

const expectErrorResult = <TData>(props: ExpectErrorResultProps<TData>) => {
  const { result } = props;

  expect(result.status).toBe(RESULT_STATUS_ERROR);

  if (result.status !== RESULT_STATUS_ERROR) {
    expect.unreachable();
  }

  const error: ResultError = result.error;

  return error;
};

type ObservedRequest = {
  readonly body: string;
  readonly defaultHeader: string | null;
  readonly method: string;
  readonly requestHeader: string | null;
  readonly url: string;
};

test(`createHttpClient({ baseUrl, headers }) applies defaults and request overrides`, async () => {
  let resolveObservedRequest: (request: ObservedRequest) => void = () =>
    undefined;
  const observedRequestPromise = new Promise<ObservedRequest>((resolve) => {
    resolveObservedRequest = resolve;
  });
  const fetch: HttpFetch = async (input) => {
    const request = input instanceof Request ? input : new Request(input);
    const body = await request.text();

    resolveObservedRequest({
      body,
      defaultHeader: request.headers.get(HTTP_HEADER_TEST_DEFAULT),
      method: request.method,
      requestHeader: request.headers.get(HTTP_HEADER_TEST_REQUEST),
      url: request.url,
    });

    const httpResponse = new Response(`ok`);

    return httpResponse;
  };
  const { httpClient } = createHttpClient({
    baseUrl: `https://api.example.test`,
    fetch,
    headers: {
      [HTTP_HEADER_TEST_DEFAULT]: `client`,
    },
  });
  const result = await httpClient.fetch(`resource`, {
    body: `payload`,
    headers: {
      [HTTP_HEADER_TEST_DEFAULT]: `request`,
      [HTTP_HEADER_TEST_REQUEST]: `yes`,
    },
    method: HTTP_METHOD_POST,
  });
  const response = expectSuccessResult({ result });
  const observedRequest = await observedRequestPromise;

  expect(response).toBeInstanceOf(Response);
  expect(observedRequest.body).toBe(`payload`);
  expect(observedRequest.method).toBe(`POST`);
  expect(observedRequest.url).toBe(`https://api.example.test/resource`);
  expect(observedRequest.defaultHeader).toBe(`request`);
  expect(observedRequest.requestHeader).toBe(`yes`);
});

test(`httpClient.fetch(...) returns non-2xx responses as success`, async () => {
  const fetch: HttpFetch = async () => {
    const httpResponse = new Response(`missing`, {
      status: 404,
      statusText: `Not Found`,
    });

    return httpResponse;
  };
  const { httpClient } = createHttpClient({
    fetch,
  });
  const result = await httpClient.fetch(`https://example.test`);
  const response = expectSuccessResult({ result });

  expect(response.status).toBe(404);
  expect(await response.text()).toBe(`missing`);
});

test(`httpClient.fetch(...) retries retryable status responses through ky`, async () => {
  let requestCount = 0;
  const fetch: HttpFetch = async () => {
    requestCount += 1;

    if (requestCount === 1) {
      const httpResponse = new Response(`try again`, {
        status: 503,
        statusText: `Service Unavailable`,
      });

      return httpResponse;
    }

    const httpResponse = new Response(`ok`);

    return httpResponse;
  };
  const { httpClient } = createHttpClient({
    fetch,
    maxAttempts: 2,
    retryDelayJitter: false,
    retryDelayMs: 0,
  });
  const result = await httpClient.fetch(`https://example.test`, {
    method: HTTP_METHOD_POST,
  });
  const response = expectSuccessResult({ result });

  expect(requestCount).toBe(2);
  expect(await response.text()).toBe(`ok`);
});

test(`httpClient.fetch(...) maps timeouts to HTTP_TIMEOUT`, async () => {
  const fetch: HttpFetch = async () => {
    const httpResponse = await new Promise<Response>(() => undefined);

    return httpResponse;
  };
  const { httpClient } = createHttpClient({
    fetch,
    maxAttempts: 1,
    timeoutMs: 5,
  });
  const result = await httpClient.fetch(`https://example.test`);
  const error = expectErrorResult({ result });

  expect(error.code).toBe(HTTP_TIMEOUT_ERROR_CODE);
});

test(`httpClient.fetch(...) maps caller aborts to HTTP_REQUEST_ABORTED`, async () => {
  const controller = new AbortController();
  let requestCount = 0;
  const fetch: HttpFetch = async () => {
    requestCount += 1;
    const httpResponse = new Response(`unexpected`);

    return httpResponse;
  };
  const { httpClient } = createHttpClient({
    fetch,
    maxAttempts: 3,
    retryDelayMs: 0,
  });

  controller.abort(new Error(`caller cancelled`));

  const result = await httpClient.fetch(`https://example.test`, {
    signal: controller.signal,
  });
  const error = expectErrorResult({ result });

  expect(requestCount).toBe(0);
  expect(error.code).toBe(HTTP_REQUEST_ABORTED_ERROR_CODE);
  expect(error.message).toBe(`HTTP request aborted: caller cancelled`);
});

test(`httpClient.fetch(...) maps transport failures to HTTP_REQUEST_FAILED`, async () => {
  const fetch: HttpFetch = async () => {
    throw new Error(`network down`);
  };
  const { httpClient } = createHttpClient({
    fetch,
    maxAttempts: 1,
  });
  const result = await httpClient.fetch(`https://example.test`);
  const error = expectErrorResult({ result });

  expect(error.code).toBe(HTTP_REQUEST_FAILED_ERROR_CODE);
  expect(error.message).toContain(`network down`);
});

test(`createHttpClient({ maxAttempts }) returns option errors from client methods`, async () => {
  let requestCount = 0;
  const fetch: HttpFetch = async () => {
    requestCount += 1;
    const httpResponse = new Response(`unexpected`);

    return httpResponse;
  };
  const { httpClient } = createHttpClient({
    fetch,
    maxAttempts: 0,
  });
  const result = await httpClient.fetch(`https://example.test`);
  const error = expectErrorResult({ result });

  expect(requestCount).toBe(0);
  expect(error.code).toBe(HTTP_INVALID_OPTIONS_ERROR_CODE);
});

test(`httpClient.fetchJson(...) parses a successful JSON response`, async () => {
  const fetch: HttpFetch = async () => {
    const httpResponse = new Response(JSON.stringify({ ok: true }));

    return httpResponse;
  };
  const { httpClient } = createHttpClient({
    fetch,
  });
  type ResultShape = { readonly ok: boolean };

  const result =
    await httpClient.fetchJson<ResultShape>(`https://example.test`);
  const data = expectSuccessResult({ result });

  expect(data.json).toEqual({ ok: true });
  expect(data.response.status).toBe(200);
});

test(`httpClient.fetchJson({ json }) stringifies JSON request bodies`, async () => {
  let resolveObservedRequest: (request: ObservedRequest) => void = () =>
    undefined;
  const observedRequestPromise = new Promise<ObservedRequest>((resolve) => {
    resolveObservedRequest = resolve;
  });
  const fetch: HttpFetch = async (input) => {
    const request = input instanceof Request ? input : new Request(input);
    const body = await request.text();

    resolveObservedRequest({
      body,
      defaultHeader: request.headers.get(HTTP_HEADER_TEST_DEFAULT),
      method: request.method,
      requestHeader: request.headers.get(HTTP_HEADER_CONTENT_TYPE),
      url: request.url,
    });

    const httpResponse = new Response(JSON.stringify({ ok: true }));

    return httpResponse;
  };
  const { httpClient } = createHttpClient({
    fetch,
  });
  const result = await httpClient.fetchJson(`https://example.test`, {
    json: {
      value: `hello`,
    },
    method: HTTP_METHOD_POST,
  });
  const data = expectSuccessResult({ result });
  const observedRequest = await observedRequestPromise;

  expect(data.json).toEqual({ ok: true });
  expect(observedRequest.body).toBe(`{"value":"hello"}`);
  expect(observedRequest.method).toBe(`POST`);
  expect(observedRequest.requestHeader).toBe(HTTP_CONTENT_TYPE_JSON);
});

test(`httpClient.fetchJson({ json }) preserves an existing content type`, async () => {
  let resolveObservedRequest: (request: ObservedRequest) => void = () =>
    undefined;
  const observedRequestPromise = new Promise<ObservedRequest>((resolve) => {
    resolveObservedRequest = resolve;
  });
  const fetch: HttpFetch = async (input) => {
    const request = input instanceof Request ? input : new Request(input);
    const body = await request.text();

    resolveObservedRequest({
      body,
      defaultHeader: request.headers.get(HTTP_HEADER_TEST_DEFAULT),
      method: request.method,
      requestHeader: request.headers.get(HTTP_HEADER_CONTENT_TYPE),
      url: request.url,
    });

    const httpResponse = new Response(JSON.stringify({ ok: true }));

    return httpResponse;
  };
  const { httpClient } = createHttpClient({
    fetch,
  });
  const result = await httpClient.fetchJson(`https://example.test`, {
    headers: {
      [HTTP_HEADER_CONTENT_TYPE]: `application/custom+json`,
    },
    json: {
      value: `hello`,
    },
    method: HTTP_METHOD_POST,
  });
  const observedRequest = await observedRequestPromise;

  expectSuccessResult({ result });
  expect(observedRequest.body).toBe(`{"value":"hello"}`);
  expect(observedRequest.requestHeader).toBe(`application/custom+json`);
});

test(`httpClient.fetchJson({ json }) returns HTTP_INVALID_REQUEST_JSON for unsupported JSON bodies`, async () => {
  const { httpClient } = createHttpClient();
  const result = await httpClient.fetchJson(`https://example.test`, {
    json: () => undefined,
    method: HTTP_METHOD_POST,
  });
  const error = expectErrorResult({ result });

  expect(error.code).toBe(HTTP_INVALID_REQUEST_JSON_ERROR_CODE);
});

test(`httpClient.fetchJson(...) returns HTTP_STATUS with a body snippet`, async () => {
  const fetch: HttpFetch = async () => {
    const httpResponse = new Response(`bad request body detail`, {
      status: 400,
      statusText: `Bad Request`,
    });

    return httpResponse;
  };
  const { httpClient } = createHttpClient({
    fetch,
    requestLabel: `JSON request`,
    responseBodySnippetLength: 11,
  });
  const result = await httpClient.fetchJson(`https://example.test`);
  const error = expectErrorResult({ result });

  expect(error.code).toBe(HTTP_STATUS_ERROR_CODE);
  expect(error.message).toBe(
    `JSON request failed with status 400 Bad Request. Response body: bad request`,
  );
});

test(`httpClient.fetchJson(...) returns HTTP_INVALID_JSON for malformed success bodies`, async () => {
  const fetch: HttpFetch = async () => {
    const httpResponse = new Response(`{`);

    return httpResponse;
  };
  const { httpClient } = createHttpClient({
    fetch,
  });
  const result = await httpClient.fetchJson(`https://example.test`);
  const error = expectErrorResult({ result });

  expect(error.code).toBe(HTTP_INVALID_JSON_ERROR_CODE);
  expect(error.message.includes(`invalid JSON response body`)).toBe(true);
});
