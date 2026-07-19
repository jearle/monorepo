export const setCLIFailureExitCode = () => {
  // oxlint-disable-next-line monorepo-conventions/no-object-mutation -- CLI failures must set the process exit code without terminating execution.
  process.exitCode = 1;
};
