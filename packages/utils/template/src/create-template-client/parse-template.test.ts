import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';
import { RESULT_STATUS_ERROR, RESULT_STATUS_SUCCESS } from '@jearle/util-result';

import { createTemplateClient } from '.';

test(`parse validates configured client imports without executing filters`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-parse-`));
  const nestedPath = path.join(directoryPath, `nested`);
  let filterCalls = 0;

  try {
    await mkdir(nestedPath);
    await writeFile(
      path.join(directoryPath, `outer.templ`),
      `{% include "./nested/inner" %}`,
    );
    await writeFile(path.join(nestedPath, `inner.templ`), `inner`);
    const { templateClient } = createTemplateClient({
      extname: `.templ`,
      filters: {
        touch: (value) => {
          filterCalls += 1;

          return value;
        },
      },
      partials: directoryPath,
    });
    const result = await templateClient.parse(
      `{{ "authored" | touch }}{% include "./outer" %}`,
    );

    expect(result).toEqual({
      data: { hasFileImports: true },
      status: RESULT_STATUS_SUCCESS,
    });
    expect(filterCalls).toBe(0);
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});

test(`parse rejects missing configured client imports`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-parse-`));

  try {
    const { templateClient } = createTemplateClient({
      extname: `.templ`,
      partials: directoryPath,
    });
    const result = await templateClient.parse(`{% include "missing" %}`);

    expect(result.status).toBe(RESULT_STATUS_ERROR);

    if (result.status !== RESULT_STATUS_ERROR) {
      expect.unreachable();
    }

    expect(result.error.message).toContain(`template import was not found`);
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});

test(`parse can detect imports without resolving configured client roots`, async () => {
  const { templateClient } = createTemplateClient();
  const result = await templateClient.parse(`{% include "missing" %}`, {
    resolveStaticImports: false,
  });

  expect(result).toEqual({
    data: { hasFileImports: true },
    status: RESULT_STATUS_SUCCESS,
  });
});

test(`parse rejects configured client import cycles`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-parse-`));

  try {
    await Promise.all([
      writeFile(path.join(directoryPath, `a.templ`), `{% include "b" %}`),
      writeFile(path.join(directoryPath, `b.templ`), `{% include "a" %}`),
    ]);
    const { templateClient } = createTemplateClient({
      extname: `.templ`,
      partials: directoryPath,
    });
    const result = await templateClient.parse(`{% include "a" %}`);

    expect(result.status).toBe(RESULT_STATUS_ERROR);

    if (result.status !== RESULT_STATUS_ERROR) {
      expect.unreachable();
    }

    expect(result.error.message).toContain(`template import cycle detected`);
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});
