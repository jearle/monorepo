import { type Result } from '@jearle/util-result';
export type CheckIsAncestorDirectoryProps = {
  readonly directoryPath: string;
};

export type CheckIsAncestorDirectory = (
  props: CheckIsAncestorDirectoryProps,
) => Promise<boolean> | boolean;

export type FindAncestorDirectoryResult = Result<string | null>;
