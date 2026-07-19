import { type CLIContext } from '../types';
import { writeCLIStdout } from './write-cli-stdout';

export type WriteCLIStdoutLineProps = {
  readonly data: string;
};

export const writeCLIStdoutLine = (
  ctx: CLIContext,
  props: WriteCLIStdoutLineProps,
) => {
  const { data } = props;

  writeCLIStdout(ctx, { data: `${data}\n` });
};
