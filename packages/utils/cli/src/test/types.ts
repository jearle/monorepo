export type CapturedCLIResult = {
  readonly exitCode: number;
  readonly stderr: string;
  readonly stdout: string;
};
