export type QueryReadOneByOptionalResultFailure = {
  readonly success: false;
  readonly error: Error;
};

export type QueryReadOneByOptionalResultSuccess<TData> = {
  readonly success: true;
  readonly data: TData | null;
};

export type QueryReadOneByOptionalResult<TData> =
  | QueryReadOneByOptionalResultFailure
  | QueryReadOneByOptionalResultSuccess<TData>;
