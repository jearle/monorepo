import { type KyInstance } from 'ky';
import {
  type Result,
  type ResultFailure,
  type ResultSuccess,
} from '@jearle/util-result';

import {
  type HttpFetch,
  type HttpHooks,
  type HttpJsonResponse,
  type HttpTimeoutMs,
} from '../types';

export type NormalizedHttpClientOptions = {
  readonly baseUrl: string | undefined;
  readonly fetch: HttpFetch | undefined;
  readonly headers: HeadersInit | undefined;
  readonly hooks: HttpHooks | undefined;
  readonly maxAttempts: number;
  readonly maxRetryDelayMs: number;
  readonly requestLabel: string;
  readonly responseBodySnippetLength: number;
  readonly retryDelayJitter: boolean;
  readonly retryDelayMs: number;
  readonly retryDelayMultiplier: number;
  readonly retryMethods: readonly string[];
  readonly retryableStatuses: readonly number[];
  readonly timeoutMs: HttpTimeoutMs;
};

export type ReadyHttpClientContext = {
  readonly kyInstance: KyInstance;
  readonly optionsResult: ResultSuccess<NormalizedHttpClientOptions>;
};

export type FailedHttpClientContext = {
  readonly kyInstance: null;
  readonly optionsResult: ResultFailure;
};

export type HttpClientContext =
  | FailedHttpClientContext
  | ReadyHttpClientContext;

export type NormalizeHttpClientOptionsResult =
  Result<NormalizedHttpClientOptions>;

export type FetchHttpResult = Result<Response>;

export type FetchJsonResult<TJson> = Result<HttpJsonResponse<TJson>>;

export type ReadJsonResponseResult<TJson> = Result<TJson>;
