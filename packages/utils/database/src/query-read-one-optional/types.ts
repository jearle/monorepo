export type QueryReadOneOptionalResultFailure = {
  readonly success: false;
  readonly error: Error;
};

export type QueryReadOneOptionalResultSuccess<TData> = {
  readonly success: true;
  readonly data: TData | null;
};

export type QueryReadOneOptionalResult<TData> =
  | QueryReadOneOptionalResultFailure
  | QueryReadOneOptionalResultSuccess<TData>;
