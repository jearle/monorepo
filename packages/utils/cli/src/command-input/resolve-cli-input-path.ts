import path from 'node:path';

export type ResolveCLIInputPathProps = {
  readonly cwd: string;
  readonly filePath: string;
};

export const resolveCLIInputPath = (props: ResolveCLIInputPathProps) => {
  const { cwd, filePath } = props;
  const inputPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(cwd, filePath);

  return inputPath;
};
