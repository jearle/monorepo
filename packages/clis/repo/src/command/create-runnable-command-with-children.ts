import { type Command } from '@bunli/core';

export type CreateRunnableCommandWithChildrenProps = {
  readonly command: Command;
  readonly commands: readonly Command[];
};

export const createRunnableCommandWithChildren = (
  props: CreateRunnableCommandWithChildrenProps,
) => {
  const { command, commands } = props;
  const result = {
    ...command,
    commands,
  } as unknown as Command;

  return result;
};
