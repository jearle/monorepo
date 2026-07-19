import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';
import { RESULT_STATUS_ERROR, RESULT_STATUS_SUCCESS } from '@jearle/util-result';

import {
  type TransformCopyDirectoryEntryNameProps,
  type TransformCopyDirectoryFileContentsProps,
  copyDirectory,
  getPathExists,
} from '..';

test(`copyDirectory({ sourcePath, targetPath }) copies a directory recursively`, async () => {
  const rootPath = await mkdtemp(path.join(tmpdir(), `monorepo-util-fs-`));

  try {
    const sourcePath = path.join(rootPath, `source`);
    const targetPath = path.join(rootPath, `target`);
    await mkdir(path.join(sourcePath, `nested`), { recursive: true });
    await writeFile(path.join(sourcePath, `nested`, `file.txt`), `hello`);

    const result = await copyDirectory({ sourcePath, targetPath });
    const targetContents = await readFile(
      path.join(targetPath, `nested`, `file.txt`),
      `utf8`,
    );

    expect(result).toEqual({
      status: RESULT_STATUS_SUCCESS,
      data: targetPath,
    });
    expect(targetContents).toBe(`hello`);
  } finally {
    await rm(rootPath, { recursive: true, force: true });
  }
});

test(`copyDirectory({ ignoredNames }) skips ignored entries`, async () => {
  const rootPath = await mkdtemp(path.join(tmpdir(), `monorepo-util-fs-`));

  try {
    const sourcePath = path.join(rootPath, `source`);
    const targetPath = path.join(rootPath, `target`);
    await mkdir(path.join(sourcePath, `node_modules`), { recursive: true });
    await writeFile(path.join(sourcePath, `node_modules`, `file.txt`), `skip`);

    await copyDirectory({
      sourcePath,
      targetPath,
      ignoredNames: [`node_modules`],
    });

    const ignoredPathExists = await getPathExists({
      path: path.join(targetPath, `node_modules`),
    });

    expect(ignoredPathExists).toBe(false);
  } finally {
    await rm(rootPath, { recursive: true, force: true });
  }
});

test(`copyDirectory({ transformEntryName, transformFileContents }) transforms text templates`, async () => {
  const rootPath = await mkdtemp(path.join(tmpdir(), `monorepo-util-fs-`));

  try {
    const sourcePath = path.join(rootPath, `source`);
    const targetPath = path.join(rootPath, `target`);
    await mkdir(path.join(sourcePath, `__name`), { recursive: true });
    await writeFile(
      path.join(sourcePath, `__name`, `__name.txt`),
      `hello __name`,
    );

    const result = await copyDirectory({
      sourcePath,
      targetPath,
      transformEntryName: (props: TransformCopyDirectoryEntryNameProps) => {
        const { name } = props;
        const result = name.split(`__name`).join(`package`);

        return result;
      },
      transformFileContents: (
        props: TransformCopyDirectoryFileContentsProps,
      ) => {
        const { contents } = props;
        const result = contents.split(`__name`).join(`package`);

        return result;
      },
    });
    const targetContents = await readFile(
      path.join(targetPath, `package`, `package.txt`),
      `utf8`,
    );

    expect(result.status).toBe(RESULT_STATUS_SUCCESS);
    expect(targetContents).toBe(`hello package`);
  } finally {
    await rm(rootPath, { recursive: true, force: true });
  }
});

test(`copyDirectory({ sourcePath, targetPath }) returns errors`, async () => {
  const rootPath = await mkdtemp(path.join(tmpdir(), `monorepo-util-fs-`));

  try {
    const sourcePath = path.join(rootPath, `missing`);
    const targetPath = path.join(rootPath, `target`);
    const result = await copyDirectory({ sourcePath, targetPath });

    expect(result.status).toBe(RESULT_STATUS_ERROR);

    if (result.status === RESULT_STATUS_SUCCESS) {
      expect.unreachable();
    }

    expect(result.error.message.length).toBeGreaterThan(0);
  } finally {
    await rm(rootPath, { recursive: true, force: true });
  }
});
