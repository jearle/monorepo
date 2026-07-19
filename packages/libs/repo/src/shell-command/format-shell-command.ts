const formatShellCommandPart = (part: string) => {
  const hasWhitespace = /\s/u.test(part);

  if (hasWhitespace === false) {
    return part;
  }

  const result = JSON.stringify(part);
  return result;
};

export const formatShellCommand = (args: readonly string[]) => {
  const result = args.map(formatShellCommandPart).join(` `);
  return result;
};
