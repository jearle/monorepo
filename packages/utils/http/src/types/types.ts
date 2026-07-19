import { type Result } from '@jearle/util-result';

export type HttpFetchInput = Parameters<typeof globalThis.fetch>[0];
export type HttpFetchInit = Parameters<typeof globalThis.fetch>[1];
export type HttpFetch = (
  input: HttpFetchInput,
  init?: HttpFetchInit,
) => Promise<Response>;
export type HttpTimeoutMs = number | false;

export type HttpClientFetch = (
  input: HttpFetchInput,
  init?: HttpFetchInit,
) => Promise<Result<Response>>;
export type HttpJsonFetchInitShape = {
  readonly json?: unknown;
};

export type HttpJsonFetchInit = NonNullable<HttpFetchInit> &
  HttpJsonFetchInitShape;
export type HttpBeforeRequestHookProps = {
  readonly request: Request;
  readonly retryCount: number;
};

export type HttpBeforeRequestHook = (
  props: HttpBeforeRequestHookProps,
) => Request | Response | void | Promise<Request | Response | void>;
export type HttpBeforeRetryHookProps = {
  readonly error: unknown;
  readonly request: Request;
  readonly retryCount: number;
};

export type HttpBeforeRetryHook = (
  props: HttpBeforeRetryHookProps,
) => void | Promise<void>;
export type HttpAfterResponseHookProps = {
  readonly request: Request;
  readonly response: Response;
  readonly retryCount: number;
};

export type HttpAfterResponseHook = (
  props: HttpAfterResponseHookProps,
) => Response | void | Promise<Response | void>;

export type HttpHooks = {
  readonly afterResponse?: readonly HttpAfterResponseHook[];
  readonly beforeRequest?: readonly HttpBeforeRequestHook[];
  readonly beforeRetry?: readonly HttpBeforeRetryHook[];
};

export type HttpClientOptions = {
  readonly baseUrl?: string;
  readonly fetch?: HttpFetch;
  readonly headers?: HeadersInit;
  readonly hooks?: HttpHooks;
  readonly maxAttempts?: number;
  readonly maxRetryDelayMs?: number;
  readonly retryDelayJitter?: boolean;
  readonly retryDelayMs?: number;
  readonly retryDelayMultiplier?: number;
  readonly retryMethods?: readonly string[];
  readonly retryableStatuses?: readonly number[];
  readonly requestLabel?: string;
  readonly responseBodySnippetLength?: number;
  readonly timeoutMs?: HttpTimeoutMs;
};

export type CreateHttpClientProps = HttpClientOptions;

export type HttpJsonResponse<TJson> = {
  readonly json: TJson;
  readonly response: Response;
};

export type HttpClient = {
  readonly fetch: HttpClientFetch;
  readonly fetchJson: <TJson = unknown>(
    input: HttpFetchInput,
    init?: HttpJsonFetchInit,
  ) => Promise<Result<HttpJsonResponse<TJson>>>;
};

export type CreateHttpClientResult = {
  readonly httpClient: HttpClient;
};
