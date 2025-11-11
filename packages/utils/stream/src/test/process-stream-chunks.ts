type PropsProcessStreamChunks<TInput, TOutput> = {
  readonly stream: TransformStream<TInput, TOutput>;
  readonly chunks: TInput[];
};
export const processStreamChunks = async <TInput, TOutput>(
  props: PropsProcessStreamChunks<TInput, TOutput>,
): Promise<TOutput[]> => {
  const { stream, chunks } = props;

  const outputs: TOutput[] = [];
  const reader = stream.readable.getReader();
  const writer = stream.writable.getWriter();

  const readPromise = (async () => {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      outputs.push(value);
    }
  })();

  for (const chunk of chunks) {
    await writer.write(chunk);
  }

  try {
    await writer.close();
  } catch {
    // ignore close errors
  }

  await readPromise;
  return outputs;
};
