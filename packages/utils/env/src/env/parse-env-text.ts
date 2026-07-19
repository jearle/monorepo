const stripQuotedEnvValue = (value: string) => {
  const isSingleQuoted = value.startsWith(`'`) && value.endsWith(`'`);
  const isDoubleQuoted = value.startsWith(`"`) && value.endsWith(`"`);

  if (isSingleQuoted || isDoubleQuoted) {
    return value.slice(1, -1);
  }

  return value;
};
export type ParseEnvTextProps = {
  readonly text: string;
};

export const parseEnvText = (props: ParseEnvTextProps) => {
  const { text } = props;
  const entries = text
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line.startsWith(`#`) === false)
    .map((line) => {
      const separatorIndex = line.indexOf(`=`);

      if (separatorIndex < 0) {
        return null;
      }

      const key = line.slice(0, separatorIndex).trim();
      const rawValue = line.slice(separatorIndex + 1).trim();
      const value = stripQuotedEnvValue(rawValue);
      const entry = [key, value] as const;

      return entry;
    })
    .filter((entry) => entry !== null);
  const env = Object.fromEntries(entries);

  return env;
};
