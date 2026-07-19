import { createTerminalColorizer } from '../terminal-color';

export type FormatTerminalCommandPrefixProps = {
  readonly command: string;
  readonly label?: string;
  readonly shouldPrintCommand?: boolean;
  readonly shouldUseColor?: boolean;
};

export const formatTerminalCommandPrefix = (
  props: FormatTerminalCommandPrefixProps,
) => {
  const {
    command,
    label,
    shouldPrintCommand = true,
    shouldUseColor = true,
  } = props;

  if (label === undefined) {
    return ``;
  }

  const colorizer = createTerminalColorizer({ shouldUseColor });
  const formattedLabel = colorizer.bold(label);

  if (shouldPrintCommand === false) {
    const result = `\n${formattedLabel}\n`;
    return result;
  }

  const formattedCommand = colorizer.cyan(`$ ${command}`);
  const result = `\n${formattedLabel}\n${formattedCommand}\n`;

  return result;
};
