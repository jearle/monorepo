import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';
import { RESULT_STATUS_ERROR, RESULT_STATUS_SUCCESS } from '@jearle/util-result';

import {
  TEMPLATE_MISSING_VARIABLE_ERROR_CODE,
  TEMPLATE_PARSE_ERROR_CODE,
} from '../errors';

import { createTemplateClient } from '.';

type RenderFixtureProps = {
  readonly data: Record<string, unknown>;
  readonly template: string;
};

const renderFixture = async (props: RenderFixtureProps) => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-strict-`));
  const sourcePath = path.join(directoryPath, `config.templ`);
  const { data, template } = props;

  try {
    await writeFile(sourcePath, template);
    const { templateClient } = createTemplateClient();

    const result = await templateClient.renderSource(
      { sourcePath, template },
      data,
    );

    return result;
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
};

test(`source rendering rejects missing variables by default`, async () => {
  const result = await renderFixture({ data: {}, template: `{{ missing }}` });

  expect(result.status).toBe(RESULT_STATUS_ERROR);

  if (result.status !== RESULT_STATUS_ERROR) {
    expect.unreachable();
  }

  expect(result.error.code).toBe(TEMPLATE_MISSING_VARIABLE_ERROR_CODE);
});

test(`source rendering rejects unknown filters by default`, async () => {
  const result = await renderFixture({
    data: { value: `value` },
    template: `{{ value | missing_filter }}`,
  });

  expect(result.status).toBe(RESULT_STATUS_ERROR);

  if (result.status !== RESULT_STATUS_ERROR) {
    expect.unreachable();
  }

  expect(result.error.code).toBe(TEMPLATE_PARSE_ERROR_CODE);
});

test(`source rendering does not load a static import in an unreachable branch`, async () => {
  const result = await renderFixture({
    data: {},
    template: `{% if false %}{% include "./missing" %}{% endif %}ready`,
  });

  expect(result).toEqual({ data: `ready`, status: RESULT_STATUS_SUCCESS });
});
