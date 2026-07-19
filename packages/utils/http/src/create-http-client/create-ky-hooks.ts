import ky, { type Hooks } from 'ky';

import { type NormalizedHttpClientOptions } from './types';

export const createKyHooks = (options: NormalizedHttpClientOptions): Hooks => {
  const beforeRequest = options.hooks?.beforeRequest?.map((hook) => {
    const kyHook: NonNullable<Hooks[`beforeRequest`]>[number] = (
      request,
      _options,
      state,
    ) => {
      const result = hook({
        request,
        retryCount: state.retryCount,
      });

      return result;
    };

    return kyHook;
  });
  const beforeRetry = options.hooks?.beforeRetry?.map((hook) => {
    const kyHook: NonNullable<Hooks[`beforeRetry`]>[number] = (state) => {
      const result = hook({
        error: state.error,
        request: state.request,
        retryCount: state.retryCount,
      });

      return result;
    };

    return kyHook;
  });
  const userAfterResponse = options.hooks?.afterResponse?.map((hook) => {
    const kyHook: NonNullable<Hooks[`afterResponse`]>[number] = (
      request,
      _options,
      response,
      state,
    ) => {
      const result = hook({
        request,
        response,
        retryCount: state.retryCount,
      });

      return result;
    };

    return kyHook;
  });
  const retryAfterResponse: NonNullable<Hooks[`afterResponse`]>[number] = (
    _request,
    _options,
    response,
    state,
  ) => {
    const retryLimit = options.maxAttempts - 1;
    const retryableStatuses = new Set(options.retryableStatuses);
    const isRetryableStatus = retryableStatuses.has(response.status);
    const hasRetriesRemaining = state.retryCount < retryLimit;

    if (isRetryableStatus && hasRetriesRemaining) {
      const result = ky.retry();

      return result;
    }

    return undefined;
  };
  const afterResponse = [...(userAfterResponse ?? []), retryAfterResponse];
  const hooks: Hooks = {
    afterResponse,
    beforeRequest,
    beforeRetry,
  };

  return hooks;
};
