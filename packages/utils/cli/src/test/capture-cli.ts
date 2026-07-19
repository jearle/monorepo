import { type CapturedCLIResult } from './types';

export type CaptureCLIProps = {
  readonly run: () => Promise<void>;
};

export const captureCLI = async (
  props: CaptureCLIProps,
): Promise<CapturedCLIResult> => {
  const { run } = props;
  const stdout: string[] = [];
  const stderr: string[] = [];
  const originalStdoutWrite = process.stdout.write;
  const originalStderrWrite = process.stderr.write;

  process.exitCode = 0;

  process.stdout.write = (chunk: unknown) => {
    stdout.push(String(chunk));

    return true;
  };
  process.stderr.write = (chunk: unknown) => {
    stderr.push(String(chunk));

    return true;
  };

  try {
    await run();

    const exitCode =
      typeof process.exitCode === `number` ? process.exitCode : 0;
    const result: CapturedCLIResult = {
      exitCode,
      stderr: stderr.join(``),
      stdout: stdout.join(``),
    };

    return result;
  } finally {
    process.stdout.write = originalStdoutWrite;
    process.stderr.write = originalStderrWrite;
    process.exitCode = 0;
  }
};
