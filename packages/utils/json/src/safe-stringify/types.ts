export type JSONStringifyResultSuccess = {
  readonly success: true;
  readonly data: string;
};
export type JSONStringifyResultFailure = {
  readonly success: false;
  readonly error: Error;
};
export type JSONStringifyResult =
  | JSONStringifyResultSuccess
  | JSONStringifyResultFailure;
