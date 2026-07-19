export type JobResult<TData = unknown> = {
  readonly data?: TData;
  readonly exitCode: number;
  readonly label: string;
};

export type Job<TData = unknown> = {
  readonly label: string;
  readonly run: () => Promise<number | Omit<JobResult<TData>, `label`>>;
};

export type RunJobsResult<TData = unknown> = {
  readonly exitCode: number;
  readonly jobResults: readonly JobResult<TData>[];
};
