export type QueryAllResultFailure = {
  readonly success: false;
  readonly error: Error;
};

export type QueryAllResultSuccess<TData> = {
  readonly success: true;
  readonly data: readonly TData[];
};

export type QueryAllResult<TData> =
  | QueryAllResultFailure
  | QueryAllResultSuccess<TData>;
