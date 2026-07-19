import { type TextInputProps, TextInput } from '@mantine/core';

export type InputProps = TextInputProps;
export const Input = (props: InputProps) => {
  return <TextInput data-testid={`ui-core.input.Input`} {...props} />;
};
