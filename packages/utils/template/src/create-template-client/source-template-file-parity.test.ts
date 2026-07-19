import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';
import { RESULT_STATUS_SUCCESS } from '@jearle/util-result';

import { createTemplateClient } from '.';

test(`source and file rendering share nested include and render semantics`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-parity-`));
  const sourcePath = path.join(directoryPath, `config.templ`);
  const template = [
    `{% include "wrapper", value: supplied %}|`,
    `{% render "wrapper", value: supplied %}`,
  ].join(``);

  try {
    await writeFile(sourcePath, template);
    await writeFile(
      path.join(directoryPath, `wrapper.templ`),
      `<{% include "nested", value: value %}>`,
    );
    await writeFile(path.join(directoryPath, `nested.templ`), `{{ value }}`);
    const { templateClient } = createTemplateClient({
      extname: `.templ`,
      partials: directoryPath,
      root: directoryPath,
    });
    const data = { supplied: `same` };
    const sourceResult = await templateClient.renderSource(
      { sourcePath, template },
      data,
    );
    const fileResult = await templateClient.renderFile(`config.templ`, data);

    expect(sourceResult).toEqual({
      data: `<same>|<same>`,
      status: RESULT_STATUS_SUCCESS,
    });
    expect(fileResult).toEqual(sourceResult);
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});
