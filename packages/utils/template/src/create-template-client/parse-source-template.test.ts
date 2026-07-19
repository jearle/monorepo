import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';
import { RESULT_STATUS_ERROR, RESULT_STATUS_SUCCESS } from '@jearle/util-result';

import { createTemplateClient } from '.';

test(`parseSource validates static imports without executing filters or dynamic imports`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-parse-`));
  const sourcePath = path.join(directoryPath, `config.json`);
  let filterCalls = 0;

  try {
    await writeFile(sourcePath, ``);
    await writeFile(path.join(directoryPath, `valid.templ`), `valid`);
    const { templateClient } = createTemplateClient({
      filters: {
        choose: (value) => {
          filterCalls += 1;
          return value;
        },
      },
    });
    const template =
      `{% assign selected = partial | choose %}` + `{% include selected %}`;
    const parsed = await templateClient.parseSource({
      extname: `.templ`,
      importRoots: {},
      sourcePath,
      template,
    });

    expect(parsed).toEqual({
      data: { hasFileImports: true },
      status: RESULT_STATUS_SUCCESS,
    });
    expect(filterCalls).toBe(0);

    const rendered = await templateClient.renderSource(
      {
        extname: `.templ`,
        importRoots: {},
        sourcePath,
        template,
      },
      { partial: `./valid` },
      { strictVariables: true },
    );

    expect(rendered).toEqual({ data: `valid`, status: RESULT_STATUS_SUCCESS });
    expect(filterCalls).toBe(1);
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});

test(`explicit operation roots isolate config imports from client roots`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-roots-`));
  const configPath = path.join(directoryPath, `config`, `config.json`);
  const sharedPath = path.join(directoryPath, `templates`);
  const template = `{% include "templates/shared" %}`;

  try {
    await mkdir(path.dirname(configPath), { recursive: true });
    await mkdir(sharedPath);
    await writeFile(configPath, ``);
    await writeFile(path.join(sharedPath, `shared.templ`), `shared`);
    const { templateClient } = createTemplateClient({
      extname: `.templ`,
      root: directoryPath,
    });
    const isolated = await templateClient.parseSource({
      extname: `.templ`,
      importRoots: {},
      sourcePath: configPath,
      template,
    });
    const promptOwned = await templateClient.parseSource({
      extname: `.templ`,
      importRoots: { root: directoryPath },
      sourcePath: configPath,
      template,
    });

    expect(isolated.status).toBe(RESULT_STATUS_ERROR);
    expect(promptOwned.status).toBe(RESULT_STATUS_SUCCESS);
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});
