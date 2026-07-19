import pMap from 'p-map';

import { type Job, type JobResult, type RunJobsResult } from './types';

export type JobCompletion<TData = unknown> = {
  readonly completedJobCount: number;
  readonly jobCount: number;
  readonly jobResult: JobResult<TData>;
};

const normalizeConcurrency = (concurrency: number, jobCount: number) => {
  const positiveConcurrency = Math.max(1, Math.floor(concurrency));
  const result = Math.min(positiveConcurrency, jobCount);

  return result;
};

const normalizeJobResult = <TData>(
  job: Job<TData>,
  value: number | Omit<JobResult<TData>, `label`>,
) => {
  if (typeof value === `number`) {
    const result: JobResult<TData> = {
      exitCode: value,
      label: job.label,
    };

    return result;
  }

  const result: JobResult<TData> = {
    ...value,
    label: job.label,
  };

  return result;
};
export type RunJobsProps<TData = unknown> = {
  readonly concurrency: number;
  readonly jobs: readonly Job<TData>[];
  readonly onJobComplete?: (
    props: JobCompletion<TData>,
  ) => Promise<void> | void;
};

export const runJobs = async <TData = unknown>(props: RunJobsProps<TData>) => {
  const { concurrency, jobs, onJobComplete } = props;

  if (jobs.length === 0) {
    const result: RunJobsResult<TData> = {
      exitCode: 0,
      jobResults: [],
    };

    return result;
  }

  const boundedConcurrency = normalizeConcurrency(concurrency, jobs.length);
  let completedJobCount = 0;
  let exitCode = 0;

  const jobResults = await pMap(
    jobs,
    async (job) => {
      const value = await job.run();
      const jobResult = normalizeJobResult(job, value);

      completedJobCount = completedJobCount + 1;

      if (jobResult.exitCode !== 0) {
        exitCode = 1;
      }

      await onJobComplete?.({
        completedJobCount,
        jobCount: jobs.length,
        jobResult,
      });

      return jobResult;
    },
    {
      concurrency: boundedConcurrency,
    },
  );
  const result: RunJobsResult<TData> = {
    exitCode,
    jobResults,
  };

  return result;
};
