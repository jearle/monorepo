export type CLICommandSuccess<TData> = {
  readonly data: TData;
  readonly success: true;
};

export type CLICommandFailure = {
  readonly success: false;
};

export type CLICommandResult<TData> =
  | CLICommandFailure
  | CLICommandSuccess<TData>;
