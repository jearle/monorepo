import { test, expect } from 'bun:test';
import { chainTransformStreams } from './chain-transform-streams';

test('chainTransformStreams should correctly pipe data through multiple streams', async () => {
  const numberToStringStream = new TransformStream<number, string>({
    transform(chunk, controller) {
      controller.enqueue(String(chunk));
    },
  });

  const addPrefixStream = new TransformStream<string, string>({
    transform(chunk, controller) {
      controller.enqueue(`HELLO-${chunk}`);
    },
  });

  const addSuffixStream = new TransformStream<string, string>({
    transform(chunk, controller) {
      controller.enqueue(`${chunk}-WORLD`);
    },
  });

  const chainedStream = chainTransformStreams(
    numberToStringStream,
    addPrefixStream,
    addSuffixStream,
  );

  const sourceStream = new ReadableStream<number>({
    start(controller) {
      controller.enqueue(1);
      controller.enqueue(2);
      controller.enqueue(3);
      controller.close();
    },
  });

  const resultStream = sourceStream.pipeThrough(chainedStream);

  const results = await Bun.readableStreamToArray(resultStream);

  expect(results).toEqual(['HELLO-1-WORLD', 'HELLO-2-WORLD', 'HELLO-3-WORLD']);
});
