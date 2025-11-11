import { safeStringify } from '@jearle/util-json';

import type {
  JSONStringifyStreamInput,
  JSONStringifyStreamSuccessOutput,
  JSONStringifyStreamFailureOutput,
  JSONStringifyStreamOutput,
} from './types';

export const createSafeStringifyJSONTransformStream = () => {
  const safeStringifyJSONTransformStream = new TransformStream<
    JSONStringifyStreamInput,
    JSONStringifyStreamOutput
  >({
    transform(chunk, controller) {
      const { data } = chunk;

      const stringifiedJSONResult = safeStringify(data);

      const { success } = stringifiedJSONResult;

      if (!success) {
        const { error } = stringifiedJSONResult;
        const output: JSONStringifyStreamFailureOutput = {
          success: false,
          error,
        };

        controller.enqueue(output);
        return;
      }

      const { data: jsonData } = stringifiedJSONResult;
      const output: JSONStringifyStreamSuccessOutput = {
        success: true,
        data: jsonData,
      };

      controller.enqueue(output);
    },
  });

  const result = { safeStringifyJSONTransformStream };

  return result;
};
