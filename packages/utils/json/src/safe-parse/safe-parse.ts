import type {
  JSONParseResult,
  JSONParseResultFailure,
  JSONParseResultSuccess,
} from './types';

export const safeParse = <T = unknown>(value: string): JSONParseResult<T> => {
  try {
    const data = JSON.parse(value) as T;

    const result: JSONParseResultSuccess<T> = { success: true, data };
    return result;
  } catch (parseError) {
    const error =
      parseError instanceof Error ? parseError : new Error(String(parseError));

    const result: JSONParseResultFailure = {
      success: false,
      error,
    };
    return result;
  }
};
