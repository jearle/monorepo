import { type CLIContext } from '../types';

export type WriteCLIStdoutProps = {
  readonly data: string;
};

export const writeCLIStdout = (ctx: CLIContext, props: WriteCLIStdoutProps) => {
  void ctx;

  const { data } = props;

  process.stdout.write(data);
};
