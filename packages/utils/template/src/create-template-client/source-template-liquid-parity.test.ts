import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';
import { RESULT_STATUS_SUCCESS } from '@jearle/util-result';

import { type TemplateData } from '../types';

import { createTemplateClient } from '.';

test(`source rendering preserves implicit include and render aliases`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-aliases-`));

  try {
    const sourcePath = path.join(directoryPath, `config.templ`);
    const template = [
      `{% include "product" with featured %}|`,
      `{% render "product" with featured %}`,
    ].join(``);

    await writeFile(sourcePath, template);
    await writeFile(
      path.join(directoryPath, `product.templ`),
      `{{ product.name }}`,
    );
    const { templateClient } = createTemplateClient({ extname: `.templ` });
    const result = await templateClient.renderSource(
      { sourcePath, template },
      { featured: { name: `Example` } },
    );

    expect(result).toEqual({
      status: RESULT_STATUS_SUCCESS,
      data: `Example|Example`,
    });
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});

test(`source rendering supports Liquid virtual and computed properties`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-properties-`));

  try {
    const sourcePath = path.join(directoryPath, `config.templ`);
    const template = [
      `{{ values[key] }}|`,
      `{{ items.size }}|`,
      `{{ items.first }}|`,
      `{{ items.last }}`,
    ].join(``);

    await writeFile(sourcePath, template);
    const { templateClient } = createTemplateClient();
    const result = await templateClient.renderSource(
      { sourcePath, template },
      {
        items: [`first`, `last`],
        key: `chosen`,
        values: { chosen: `computed` },
      },
    );

    expect(result).toEqual({
      status: RESULT_STATUS_SUCCESS,
      data: `computed|2|first|last`,
    });
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});

test(`source rendering resolves dynamic imports from render locals`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-dynamic-`));

  try {
    const sourcePath = path.join(directoryPath, `config.templ`);
    const template = `{% render "./chooser", choice: selected %}`;

    await writeFile(sourcePath, template);
    await writeFile(
      path.join(directoryPath, `chooser.templ`),
      `{% include choice %}`,
    );
    await writeFile(path.join(directoryPath, `selected.templ`), `selected`);
    const { templateClient } = createTemplateClient({ extname: `.templ` });
    const result = await templateClient.renderSource(
      { sourcePath, template },
      { selected: `./selected` },
    );

    expect(result).toEqual({ status: RESULT_STATUS_SUCCESS, data: `selected` });
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});

test(`source rendering honors variable and ownership overrides`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-overrides-`));

  try {
    const sourcePath = path.join(directoryPath, `config.templ`);

    await writeFile(sourcePath, ``);
    const { templateClient } = createTemplateClient();
    const lenientResult = await templateClient.renderSource(
      { sourcePath, template: `x{{ missing }}y` },
      {},
      { strictVariables: false },
    );
    const inheritedData = Object.create({
      nested: { value: `inherited` },
    }) as TemplateData;
    const inheritedResult = await templateClient.renderSource(
      { sourcePath, template: `{{ nested.value }}` },
      inheritedData,
      { ownPropertyOnly: false },
    );

    expect(lenientResult).toEqual({
      status: RESULT_STATUS_SUCCESS,
      data: `xy`,
    });
    expect(inheritedResult).toEqual({
      status: RESULT_STATUS_SUCCESS,
      data: `inherited`,
    });
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});

test(`source rendering preserves lazy non-enumerable own properties`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-own-data-`));
  const sourcePath = path.join(directoryPath, `config.templ`);
  const template = `{% include selected %}`;
  const data: Record<string, unknown> = {};

  Object.defineProperties(data, {
    selected: {
      enumerable: false,
      get: () => `./valid`,
    },
    unused: {
      enumerable: false,
      get: () => {
        throw new Error(`unused getter must remain lazy`);
      },
    },
  });

  try {
    await writeFile(sourcePath, template);
    await writeFile(path.join(directoryPath, `valid.templ`), `valid`);
    const { templateClient } = createTemplateClient({
      extname: `.templ`,
      ownPropertyOnly: true,
    });
    const rendered = await templateClient.renderSource(
      { sourcePath, template },
      data,
    );

    expect(rendered).toEqual({ data: `valid`, status: RESULT_STATUS_SUCCESS });
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});
