import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';
import { RESULT_STATUS_SUCCESS } from '@jearle/util-result';

import { createTemplateClient } from '.';

test(`nested relative imports resolve from canonical symlink targets`, async () => {
  const directoryPath = await mkdtemp(
    path.join(tmpdir(), `monorepo-nested-symlink-`),
  );

  try {
    const authorPath = path.join(directoryPath, `author`);
    const targetPath = path.join(directoryPath, `target`);
    const sourcePath = path.join(authorPath, `config.templ`);
    const template = `{% include "./linked.templ" %}`;

    await Promise.all([mkdir(authorPath), mkdir(targetPath)]);
    await writeFile(sourcePath, template);
    await writeFile(
      path.join(targetPath, `outer.templ`),
      `{% include "./inner.templ" %}`,
    );
    await writeFile(path.join(targetPath, `inner.templ`), `canonical`);
    await symlink(
      path.join(targetPath, `outer.templ`),
      path.join(authorPath, `linked.templ`),
      `file`,
    );
    const { templateClient } = createTemplateClient();
    const result = await templateClient.renderSource(
      { sourcePath, template },
      {},
    );

    expect(result).toEqual({
      status: RESULT_STATUS_SUCCESS,
      data: `canonical`,
    });
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});
