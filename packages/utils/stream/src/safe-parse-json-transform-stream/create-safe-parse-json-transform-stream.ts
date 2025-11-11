import { safeParse } from '@jearle/util-json';

import type {
  JSONTransformStreamInput,
  JSONTransformStreamSuccessOutput,
  JSONTransformStreamFailureOutput,
  JSONTransformStreamOutput,
} from './types';

export const createSafeParseJSONTransformStream = <T = unknown>() => {
  const safeParseJSONTransformStream = new TransformStream<
    JSONTransformStreamInput,
    JSONTransformStreamOutput<T>
  >({
    transform(chunk, controller) {
      const { data } = chunk;

      const parsedJSONResult = safeParse(data);

      const { success } = parsedJSONResult;

      if (!success) {
        const { error } = parsedJSONResult;
        const output: JSONTransformStreamFailureOutput = {
          success: false,
          error,
        };

        controller.enqueue(output);
        return;
      }

      const { data: jsonData } = parsedJSONResult;
      const output: JSONTransformStreamSuccessOutput<T> = {
        success: true,
        data: jsonData as T,
      };

      controller.enqueue(output);
    },
  });

  const result = { safeParseJSONTransformStream };

  return result;
};
