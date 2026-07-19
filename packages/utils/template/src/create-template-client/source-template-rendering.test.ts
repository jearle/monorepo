import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';
import { type SourceTemplate } from '../types';

import { createTemplateClient } from '.';
import { type Result, RESULT_STATUS_SUCCESS } from '@jearle/util-result';

const expectSuccess = <TData>(result: Result<TData>) => {
  expect(result.status).toBe(RESULT_STATUS_SUCCESS);

  if (result.status !== RESULT_STATUS_SUCCESS) {
    expect.unreachable();
  }
  const data = result.data;

  return data;
};

test(`renderSource(...) renders variables, branches, loops, and custom filters exactly`, async () => {
  const directoryPath = await mkdtemp(
    path.join(tmpdir(), `monorepo-source-render-`),
  );

  try {
    const template = [
      `{% if account.active %}`,
      `{% for item in items %}`,
      `{{ account.name | shout: "!" }}={{ item }}`,
      `{% unless forloop.last %}|{% endunless %}`,
      `{% endfor %}`,
      `{% else %}inactive{% endif %}`,
    ].join(``);
    const sourcePath = path.join(directoryPath, `message.templ`);
    const source: SourceTemplate = { sourcePath, template };

    await writeFile(sourcePath, template);

    const { templateClient } = createTemplateClient({
      filters: {
        shout: (value, suffix) => {
          const result = `${String(value).toUpperCase()}${String(suffix)}`;

          return result;
        },
      },
    });
    const result = await templateClient.renderSource(source, {
      account: { active: true, name: `ada` },
      items: [`one`, `two`],
    });

    expect(expectSuccess(result)).toBe(`ADA!=one|ADA!=two`);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});
