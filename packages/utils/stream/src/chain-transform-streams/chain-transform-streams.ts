export const chainTransformStreams = <I, O>(
  ...transformStreams: [
    TransformStream<I, unknown>,
    ...TransformStream<unknown, unknown>[],
    TransformStream<unknown, O>,
  ]
): TransformStream<I, O> => {
  if (transformStreams.length === 0) {
    return new TransformStream<I, O>();
  }

  const writable = transformStreams[0].writable;

  let readable: ReadableStream<unknown> = transformStreams[0].readable;

  for (let i = 1; i < transformStreams.length; i++) {
    const stream = transformStreams[i];

    readable = readable.pipeThrough(
      stream as TransformStream<unknown, unknown>,
    );
  }

  const finalReadable = readable as ReadableStream<O>;

  const chainedTransformStreams = {
    writable,
    readable: finalReadable,
  };

  return chainedTransformStreams;
};
