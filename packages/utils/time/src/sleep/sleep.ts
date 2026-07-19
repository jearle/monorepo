export type SleepProps = {
  readonly delayMs: number;
  readonly signal?: AbortSignal;
};

export const sleep = async (props: SleepProps) => {
  const { delayMs, signal } = props;

  if (signal?.aborted === true) {
    throw signal.reason;
  }

  if (delayMs <= 0) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const onAbort = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      signal?.removeEventListener(`abort`, onAbort);
      reject(signal?.reason);
    };

    timeoutId = setTimeout(() => {
      signal?.removeEventListener(`abort`, onAbort);
      resolve();
    }, delayMs);

    signal?.addEventListener(`abort`, onAbort, {
      once: true,
    });
  });
};
