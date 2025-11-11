export type JSONTransformStreamInput = {
  readonly data: string;
};
export type JSONTransformStreamSuccessOutput<T = unknown> = {
  readonly success: true;
  readonly data: T;
};

export type JSONTransformStreamFailureOutput = {
  readonly success: false;
  readonly error: Error;
};

export type JSONTransformStreamOutput<T = unknown> =
  | JSONTransformStreamSuccessOutput<T>
  | JSONTransformStreamFailureOutput;
