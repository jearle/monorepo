export type OnChunk<T> = (chunk: T | undefined) => void;

export type PropsReadStream<T> = {
  readonly stream: ReadableStream<T>;
  readonly onChunk: OnChunk<T>;
};

export const readStream = <T>(props: PropsReadStream<T>): Promise<void> => {
  const { stream, onChunk } = props;

  const reader = stream.getReader();

  return new Promise((resolve, reject) => {
    const read = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          onChunk(value);
        }
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        reader.releaseLock();
      }
    };

    read();
  });
};
