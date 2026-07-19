import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';
import { RESULT_STATUS_SUCCESS } from '@jearle/util-result';

import { createTemplateClient } from '.';

test(`source operations preserve offset continue control state`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-continue-`));
  const sourcePath = path.join(directoryPath, `config.templ`);
  const template = [
    `{% for item in items limit: 1 %}{{ item }}{% endfor %}`,
    `{% for item in items limit: 1 offset: continue %}{{ item }}{% endfor %}`,
    `{% include selected %}`,
  ].join(``);
  const data = { items: [`a`, `b`, `c`], selected: `./selected` };

  try {
    await writeFile(sourcePath, template);
    await writeFile(path.join(directoryPath, `selected.templ`), `ok`);
    const { templateClient } = createTemplateClient({ extname: `.templ` });
    const rendered = await templateClient.renderSource(
      { sourcePath, template },
      data,
    );

    expect(rendered).toEqual({ data: `abok`, status: RESULT_STATUS_SUCCESS });
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});
