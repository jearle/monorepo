import type {
  JSONStringifyResult,
  JSONStringifyResultFailure,
  JSONStringifyResultSuccess,
} from './types';

export const safeStringify = (
  value: unknown,
  space?: string,
): JSONStringifyResult => {
  if (value === null || value === undefined || typeof value !== `object`) {
    const resultFailure: JSONStringifyResultFailure = {
      success: false,
      error: new Error(`Object objects and arrays supported. Got: ${value}`),
    };

    return resultFailure;
  }

  try {
    const data = JSON.stringify(value, null, space);

    const resultSuccess: JSONStringifyResultSuccess = {
      success: true,
      data,
    };

    return resultSuccess;
  } catch (errorUnknown: unknown) {
    const error =
      errorUnknown instanceof Error
        ? errorUnknown
        : new Error(`${errorUnknown}`);

    const resultFailure: JSONStringifyResultFailure = {
      success: false,
      error,
    };

    return resultFailure;
  }
};
