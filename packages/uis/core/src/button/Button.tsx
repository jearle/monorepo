import {
  type ButtonProps as MantineButtonProps,
  type PolymorphicComponentProps,
  Button as MantineButton,
} from '@mantine/core';

export type ButtonProps = PolymorphicComponentProps<
  `button`,
  MantineButtonProps
>;
export const Button = (props: ButtonProps) => {
  return <MantineButton data-testid={`ui-core.Button.Button`} {...props} />;
};
