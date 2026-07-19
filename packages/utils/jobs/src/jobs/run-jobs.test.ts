import { expect, test } from 'bun:test';

import { runJobs } from '.';

const waitForNextJob = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

test(`runJobs({ jobs, concurrency }) limits active jobs and aggregates failures`, async () => {
  let activeJobCount = 0;
  let maxActiveJobCount = 0;
  const completedJobCounts: number[] = [];
  const jobIndexes = [0, 1, 2, 3, 4];
  const jobs = jobIndexes.map((jobIndex) => ({
    label: `job ${jobIndex}`,
    run: async () => {
      activeJobCount = activeJobCount + 1;
      maxActiveJobCount = Math.max(maxActiveJobCount, activeJobCount);

      await waitForNextJob();

      activeJobCount = activeJobCount - 1;

      return jobIndex === 3 ? 1 : 0;
    },
  }));

  const result = await runJobs({
    concurrency: 2,
    jobs,
    onJobComplete: ({ completedJobCount }) => {
      completedJobCounts.push(completedJobCount);
    },
  });
  const labels = result.jobResults.map((jobResult) => jobResult.label);

  expect(result.exitCode).toBe(1);
  expect(maxActiveJobCount).toBe(2);
  expect(completedJobCounts).toEqual([1, 2, 3, 4, 5]);
  expect(labels).toEqual([`job 0`, `job 1`, `job 2`, `job 3`, `job 4`]);
});

test(`runJobs({ jobs: [] }) returns success`, async () => {
  const result = await runJobs({
    concurrency: 2,
    jobs: [],
  });

  expect(result).toEqual({
    exitCode: 0,
    jobResults: [],
  });
});
