import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';
import { RESULT_STATUS_ERROR } from '@jearle/util-result';

import { createTemplateClient } from '.';

test(`parse matches native rendering for configured-root escapes`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-parse-`));
  const partialsPath = path.join(directoryPath, `partials`);
  const outsidePath = path.join(directoryPath, `outside.templ`);

  try {
    await mkdir(partialsPath);
    await writeFile(outsidePath, `outside`);
    await symlink(outsidePath, path.join(partialsPath, `escape.templ`));
    const { templateClient } = createTemplateClient({
      extname: `.templ`,
      partials: partialsPath,
    });

    for (const importName of [`../outside`, `escape`]) {
      const template = `{% include "${importName}" %}`;
      const parsed = await templateClient.parse(template);
      const rendered = await templateClient.render(template, {});

      expect(parsed.status).toBe(RESULT_STATUS_ERROR);
      expect(rendered.status).toBe(RESULT_STATUS_ERROR);
    }
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});

test(`parse matches native extension lookup without extensionless fallback`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-parse-`));

  try {
    await writeFile(path.join(directoryPath, `partial`), `extensionless`);
    const { templateClient } = createTemplateClient({
      extname: `.templ`,
      partials: directoryPath,
    });
    const template = `{% include "partial" %}`;
    const parsed = await templateClient.parse(template);
    const rendered = await templateClient.render(template, {});

    expect(parsed.status).toBe(RESULT_STATUS_ERROR);
    expect(rendered.status).toBe(RESULT_STATUS_ERROR);
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});
