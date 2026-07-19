export type QueryOneResultSuccess<TData> = {
  readonly success: true;
  readonly data: TData;
};

export type QueryOneResultFailure = {
  readonly success: false;
  readonly error: Error;
};

export type QueryOneResult<TData> =
  | QueryOneResultFailure
  | QueryOneResultSuccess<TData>;
