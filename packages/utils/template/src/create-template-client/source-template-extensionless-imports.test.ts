import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';
import { RESULT_STATUS_SUCCESS } from '@jearle/util-result';

import { createTemplateClient } from '.';

for (const testCase of [
  { name: `static`, template: `{% include "./partial" %}`, data: {} },
  {
    name: `dynamic`,
    template: `{% include chosen %}`,
    data: { chosen: `./partial` },
  },
]) {
  test(`default source client resolves ${testCase.name} extensionless imports`, async () => {
    const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-ext-`));
    const sourcePath = path.join(directoryPath, `config.templ`);

    try {
      await writeFile(sourcePath, testCase.template);
      await writeFile(path.join(directoryPath, `partial`), `content`);
      const { templateClient } = createTemplateClient();
      const result = await templateClient.renderSource(
        { sourcePath, template: testCase.template },
        testCase.data,
      );

      expect(result).toEqual({
        status: RESULT_STATUS_SUCCESS,
        data: `content`,
      });
    } finally {
      await rm(directoryPath, { force: true, recursive: true });
    }
  });
}
