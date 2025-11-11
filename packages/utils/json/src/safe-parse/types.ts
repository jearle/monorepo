export type JSONParseResultSuccess<T> = {
  readonly success: true;
  readonly data: T;
};
export type JSONParseResultFailure = {
  readonly success: false;
  readonly error: Error;
};
export type JSONParseResult<T> =
  | JSONParseResultSuccess<T>
  | JSONParseResultFailure;
