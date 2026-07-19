import {
  type PasswordInputProps as MantinePasswordInputProps,
  PasswordInput as MantinePasswordInput,
} from '@mantine/core';

export type PasswordInputProps = MantinePasswordInputProps;
export const PasswordInput = (props: PasswordInputProps) => {
  return (
    <MantinePasswordInput
      data-testid={`ui-core.input.PasswordInput`}
      {...props}
    />
  );
};
