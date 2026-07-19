import { type Options } from 'ky';

import { createKyHooks } from './create-ky-hooks';
import { type NormalizedHttpClientOptions } from './types';

const createRetryDelay = (options: NormalizedHttpClientOptions) => {
  const retryDelay = (attemptCount: number) => {
    const retryIndex = attemptCount - 1;
    const retryMultiplier = options.retryDelayMultiplier ** retryIndex;
    const delayMs = options.retryDelayMs * retryMultiplier;
    const result = Math.min(delayMs, options.maxRetryDelayMs);

    return result;
  };

  return retryDelay;
};

export const createKyOptions = (
  options: NormalizedHttpClientOptions,
): Options => {
  const hooks = createKyHooks(options);
  const kyOptions: Options = {
    fetch: options.fetch,
    headers: options.headers,
    hooks,
    retry: {
      backoffLimit: options.maxRetryDelayMs,
      delay: createRetryDelay(options),
      jitter: options.retryDelayJitter,
      limit: options.maxAttempts - 1,
      maxRetryAfter: options.maxRetryDelayMs,
      methods: [...options.retryMethods],
      statusCodes: [...options.retryableStatuses],
    },
    throwHttpErrors: false,
    timeout: options.timeoutMs,
  };

  return kyOptions;
};
