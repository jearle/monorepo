import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { type Dirent } from 'node:fs';

import { toAsyncResult } from '@jearle/util-result';

import {
  type CopyDirectoryResult,
  type TransformCopyDirectoryEntryName,
  type TransformCopyDirectoryFileContents,
} from './types';

type CopyDirectoryEntryProps = {
  readonly entry: Dirent;
  readonly sourcePath: string;
  readonly targetPath: string;
  readonly ignoredNames: readonly string[];
  readonly transformEntryName?: TransformCopyDirectoryEntryName;
  readonly transformFileContents?: TransformCopyDirectoryFileContents;
};

type CopyDirectoryEntriesProps = {
  readonly sourcePath: string;
  readonly targetPath: string;
  readonly ignoredNames: readonly string[];
  readonly transformEntryName?: TransformCopyDirectoryEntryName;
  readonly transformFileContents?: TransformCopyDirectoryFileContents;
};

const copyDirectoryEntry = async (
  props: CopyDirectoryEntryProps,
): Promise<void> => {
  const {
    entry,
    sourcePath,
    targetPath,
    ignoredNames,
    transformEntryName,
    transformFileContents,
  } = props;
  const sourceEntryPath = path.join(sourcePath, entry.name);
  const transformedName =
    transformEntryName === undefined
      ? entry.name
      : transformEntryName({
          name: entry.name,
          sourcePath: sourceEntryPath,
          targetDirectoryPath: targetPath,
        });
  const targetEntryPath = path.join(targetPath, transformedName);

  if (entry.isDirectory()) {
    await copyDirectoryEntries({
      sourcePath: sourceEntryPath,
      targetPath: targetEntryPath,
      ignoredNames,
      transformEntryName,
      transformFileContents,
    });

    return;
  }

  if (entry.isFile()) {
    if (transformFileContents === undefined) {
      await copyFile(sourceEntryPath, targetEntryPath);
      return;
    }

    const sourceContents = await readFile(sourceEntryPath, `utf8`);
    const targetContents = await transformFileContents({
      contents: sourceContents,
      sourcePath: sourceEntryPath,
      targetPath: targetEntryPath,
    });

    await writeFile(targetEntryPath, targetContents);
  }
};

const copyDirectoryEntries = async (
  props: CopyDirectoryEntriesProps,
): Promise<void> => {
  const {
    sourcePath,
    targetPath,
    ignoredNames,
    transformEntryName,
    transformFileContents,
  } = props;
  await mkdir(targetPath, { recursive: true });

  const entries = await readdir(sourcePath, { withFileTypes: true });
  const copyableEntries = entries.filter((entry) => {
    const isIgnoredName = ignoredNames.includes(entry.name);
    const result = isIgnoredName === false;

    return result;
  });
  const copyOperations = copyableEntries.map((entry) => {
    const result = copyDirectoryEntry({
      entry,
      sourcePath,
      targetPath,
      ignoredNames,
      transformEntryName,
      transformFileContents,
    });

    return result;
  });

  await Promise.all(copyOperations);
};

export type CopyDirectoryProps = {
  readonly sourcePath: string;
  readonly targetPath: string;
  readonly ignoredNames?: readonly string[];
  readonly transformEntryName?: TransformCopyDirectoryEntryName;
  readonly transformFileContents?: TransformCopyDirectoryFileContents;
};

export const copyDirectory = async (
  props: CopyDirectoryProps,
): Promise<CopyDirectoryResult> => {
  const {
    sourcePath,
    targetPath,
    ignoredNames = [],
    transformEntryName,
    transformFileContents,
  } = props;
  const result = await toAsyncResult({
    operation: async () => {
      await copyDirectoryEntries({
        sourcePath,
        targetPath,
        ignoredNames,
        transformEntryName,
        transformFileContents,
      });

      return targetPath;
    },
  });

  return result;
};
