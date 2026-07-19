import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';
import { RESULT_STATUS_SUCCESS } from '@jearle/util-result';

import { createTemplateClient } from '.';

test(`source relative imports fall back to configured partial roots`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-fallback-`));
  const sourceDirectoryPath = path.join(directoryPath, `source`);
  const sourcePath = path.join(sourceDirectoryPath, `config.templ`);
  const template = `{% include "./shared" %}`;

  try {
    await mkdir(sourceDirectoryPath);
    await writeFile(sourcePath, template);
    await writeFile(path.join(directoryPath, `shared.templ`), `shared`);
    const { templateClient } = createTemplateClient({
      extname: `.templ`,
      partials: directoryPath,
    });
    const result = await templateClient.renderSource(
      { sourcePath, template },
      {},
    );

    expect(result).toEqual({
      data: `shared`,
      status: RESULT_STATUS_SUCCESS,
    });
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});
