import path from 'node:path';

export type FilterFilesByExtensionProps = {
  readonly extensions: ReadonlySet<string>;
  readonly filePaths: readonly string[];
};

export const filterFilesByExtension = (props: FilterFilesByExtensionProps) => {
  const { extensions, filePaths } = props;
  const result = filePaths.filter((filePath) => {
    const extension = path.extname(filePath);
    const isMatchingFile = extensions.has(extension);

    return isMatchingFile;
  });

  return result;
};
