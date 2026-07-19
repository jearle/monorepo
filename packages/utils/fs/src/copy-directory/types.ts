import { type Result } from '@jearle/util-result';
export type TransformCopyDirectoryEntryNameProps = {
  readonly name: string;
  readonly sourcePath: string;
  readonly targetDirectoryPath: string;
};

export type TransformCopyDirectoryEntryName = (
  props: TransformCopyDirectoryEntryNameProps,
) => string;

export type TransformCopyDirectoryFileContentsProps = {
  readonly contents: string;
  readonly sourcePath: string;
  readonly targetPath: string;
};

export type TransformCopyDirectoryFileContents = (
  props: TransformCopyDirectoryFileContentsProps,
) => Promise<string> | string;

export type CopyDirectoryResult = Result<string>;
