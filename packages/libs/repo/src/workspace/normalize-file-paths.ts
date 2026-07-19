import path from 'node:path';

const checkIsInsideRepo = (relativeFilePath: string) =>
  relativeFilePath !== `..` &&
  relativeFilePath.startsWith(`../`) === false &&
  path.isAbsolute(relativeFilePath) === false;

const normalizeFilePath = (cwd: string, repoRoot: string, filePath: string) => {
  const absoluteFilePath = path.resolve(cwd, filePath);
  const relativeFilePath = path.relative(repoRoot, absoluteFilePath);
  const isInsideRepo = checkIsInsideRepo(relativeFilePath);

  if (isInsideRepo === false) {
    return null;
  }

  const result = relativeFilePath.split(path.sep).join(`/`);
  return result;
};
export type NormalizeFilePathsProps = {
  readonly cwd: string;
  readonly repoRoot: string;
  readonly filePaths: readonly string[];
};

export const normalizeFilePaths = (props: NormalizeFilePathsProps) => {
  const { cwd, filePaths, repoRoot } = props;
  const normalizedFilePaths = filePaths.flatMap((filePath) => {
    const normalizedFilePath = normalizeFilePath(cwd, repoRoot, filePath);

    if (normalizedFilePath === null) {
      return [];
    }

    return [normalizedFilePath];
  });
  const result = [...new Set(normalizedFilePaths)].toSorted();

  return result;
};
