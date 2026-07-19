const DEFAULT_BACKOFF_MAX_DELAY_MS = 30_000;
const DEFAULT_BACKOFF_MULTIPLIER = 2;
export type GetBackoffDelayProps = {
  readonly initialDelayMs: number;
  readonly jitter?: boolean;
  readonly maxDelayMs?: number;
  readonly multiplier?: number;
  readonly random?: () => number;
  readonly retryIndex: number;
};

/**
 * Calculates the delay before a retry using exponential backoff. The retry
 * index is zero-based, so the first retry uses the initial delay.
 */
export const getBackoffDelay = (props: GetBackoffDelayProps) => {
  const {
    initialDelayMs,
    jitter,
    maxDelayMs = DEFAULT_BACKOFF_MAX_DELAY_MS,
    multiplier = DEFAULT_BACKOFF_MULTIPLIER,
    random = Math.random,
    retryIndex,
  } = props;
  const retryMultiplier = multiplier ** retryIndex;
  const exponentialDelayMs = initialDelayMs * retryMultiplier;
  const cappedDelayMs = Math.min(exponentialDelayMs, maxDelayMs);

  if (jitter !== true) {
    const result = cappedDelayMs;

    return result;
  }

  const result = Math.floor(random() * cappedDelayMs);

  return result;
};
