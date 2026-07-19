import {
  type JSONStringifyResult,
  type JSONStringifyResultFailure,
  type JSONStringifyResultSuccess,
} from './types';
import { createStringifyError } from './errors';

export const safeStringify = (
  value: unknown,
  space?: string,
): JSONStringifyResult => {
  if (value === undefined) {
    const resultFailure: JSONStringifyResultFailure = {
      success: false,
      error: new Error(`Value is not JSON serializable. Got: ${value}`),
    };

    return resultFailure;
  }

  try {
    const data = JSON.stringify(value, null, space);

    if (typeof data !== `string`) {
      const resultFailure: JSONStringifyResultFailure = {
        success: false,
        error: new Error(
          `Value is not JSON serializable. Got: ${String(value)}`,
        ),
      };

      return resultFailure;
    }

    const resultSuccess: JSONStringifyResultSuccess = {
      success: true,
      data,
    };

    return resultSuccess;
  } catch (errorUnknown: unknown) {
    const error = createStringifyError(errorUnknown);
    const resultFailure: JSONStringifyResultFailure = {
      success: false,
      error,
    };

    return resultFailure;
  }
};
