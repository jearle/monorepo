type ReadOutputsProps<TOutput> = {
  readonly reader: ReadableStreamDefaultReader<TOutput>;
  readonly outputs: readonly TOutput[];
};

const readOutputs = async <TOutput>(
  props: ReadOutputsProps<TOutput>,
): Promise<readonly TOutput[]> => {
  const { reader, outputs } = props;
  const { done, value } = await reader.read();

  if (done) {
    return outputs;
  }

  const nextOutputs = [...outputs, value];
  const result = await readOutputs({ reader, outputs: nextOutputs });

  return result;
};
export type ProcessStreamChunksProps<TInput, TOutput> = {
  readonly stream: TransformStream<TInput, TOutput>;
  readonly chunks: TInput[];
};

export const processStreamChunks = async <TInput, TOutput>(
  props: ProcessStreamChunksProps<TInput, TOutput>,
): Promise<TOutput[]> => {
  const { stream, chunks } = props;

  const reader = stream.readable.getReader();
  const writer = stream.writable.getWriter();
  const readPromise = readOutputs({ reader, outputs: [] });

  for (const chunk of chunks) {
    await writer.write(chunk);
  }

  try {
    await writer.close();
  } catch {
    // ignore close errors
  }

  const outputs = await readPromise;
  const result = [...outputs];

  return result;
};
