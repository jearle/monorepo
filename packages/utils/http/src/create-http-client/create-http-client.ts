import {
  type CreateHttpClientProps,
  type CreateHttpClientResult,
  type HttpClient,
} from '../types';
import { createHttpClientContext } from './create-http-client-context';
import { fetchHttp } from './fetch-http';
import { fetchJson } from './fetch-json';

/**
 * Creates a reusable HTTP client with fetch-shaped methods and shared defaults
 * backed by ky.
 */
export const createHttpClient = (
  props: CreateHttpClientProps = {},
): CreateHttpClientResult => {
  const ctx = createHttpClientContext(props);
  const httpClient: HttpClient = {
    fetch: (input, init) => fetchHttp(ctx, input, init),
    fetchJson: (input, init) => fetchJson(ctx, input, init),
  };
  const result = {
    httpClient,
  };

  return result;
};
