import { safeStringify } from '@jearle/util-json';

import {
  type JSONStringifyStreamFailureOutput,
  type JSONStringifyStreamInput,
  type JSONStringifyStreamOutput,
  type JSONStringifyStreamSuccessOutput,
} from './types';
import { createUnsupportedStreamDataError } from './errors';

const getIsSupportedStreamData = (data: unknown) => {
  const isObject = typeof data === `object`;
  const isNotNull = data !== null;
  const result = isObject && isNotNull;

  return result;
};

export const createSafeStringifyJSONTransformStream = () => {
  const safeStringifyJSONTransformStream = new TransformStream<
    JSONStringifyStreamInput,
    JSONStringifyStreamOutput
  >({
    transform(chunk, controller) {
      const { data } = chunk;
      const isSupportedStreamData = getIsSupportedStreamData(data);

      if (isSupportedStreamData === false) {
        const output: JSONStringifyStreamFailureOutput = {
          success: false,
          error: createUnsupportedStreamDataError(data),
        };

        controller.enqueue(output);
        return;
      }

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
