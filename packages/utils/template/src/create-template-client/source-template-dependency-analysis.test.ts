import {
  mkdir,
  mkdtemp,
  realpath,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';
import { RESULT_STATUS_SUCCESS } from '@jearle/util-result';

import { createTemplateClient } from '.';

test(`source dependency analysis returns canonical static closure and dynamic presence`, async () => {
  const directoryPath = await mkdtemp(
    path.join(tmpdir(), `monorepo-template-dependencies-`),
  );
  const configPath = path.join(directoryPath, `band`, `config.json`);
  const nestedPath = path.join(directoryPath, `band`, `nested`);
  const sharedPath = path.join(directoryPath, `shared`);
  const configuredPath = path.join(directoryPath, `configured`);
  let filterCalls = 0;

  try {
    await Promise.all([
      mkdir(nestedPath, { recursive: true }),
      mkdir(sharedPath, { recursive: true }),
      mkdir(configuredPath, { recursive: true }),
    ]);
    const outerPath = path.join(nestedPath, `outer.templ`);
    const innerPath = path.join(nestedPath, `inner.templ`);
    const footerPath = path.join(sharedPath, `footer.templ`);
    const configuredImportPath = path.join(configuredPath, `common.templ`);
    const aliasPath = path.join(directoryPath, `band`, `alias.templ`);

    await Promise.all([
      writeFile(configPath, ``),
      writeFile(outerPath, `{% include "./inner" %}`),
      writeFile(innerPath, `inner`),
      writeFile(footerPath, `footer`),
      writeFile(configuredImportPath, `configured`),
      symlink(innerPath, aliasPath),
    ]);
    const { templateClient } = createTemplateClient({
      filters: {
        choose: (value) => {
          filterCalls += 1;
          return value;
        },
      },
    });
    const template = [
      `{% render "./nested/outer" %}`,
      `{% include "../shared/footer" %}`,
      `{% include "./alias" %}`,
      `{% include "common" %}`,
      `{% assign selected = importName | choose %}`,
      `{% include selected %}`,
    ].join(``);
    const analysisResult = await templateClient.analyzeSourceDependencies({
      extname: `.templ`,
      importRoots: { root: configuredPath },
      sourcePath: configPath,
      template,
    });

    expect(analysisResult.status).toBe(RESULT_STATUS_SUCCESS);

    if (analysisResult.status !== RESULT_STATUS_SUCCESS) {
      expect.unreachable();
    }

    const expectedPaths = await Promise.all(
      [configuredImportPath, footerPath, innerPath, outerPath].map(
        async (filePath) => realpath(filePath),
      ),
    );
    expect(analysisResult.data).toEqual({
      hasDynamicFileImports: true,
      staticImportPaths: expectedPaths.toSorted(),
    });
    expect(filterCalls).toBe(0);
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});

test(`source dependency analysis returns an empty dependency summary`, async () => {
  const directoryPath = await mkdtemp(
    path.join(tmpdir(), `monorepo-template-no-dependencies-`),
  );
  const sourcePath = path.join(directoryPath, `config.json`);

  try {
    await writeFile(sourcePath, ``);
    const { templateClient } = createTemplateClient();
    const analysisResult = await templateClient.analyzeSourceDependencies({
      sourcePath,
      template: `plain text`,
    });

    expect(analysisResult).toEqual({
      data: {
        hasDynamicFileImports: false,
        staticImportPaths: [],
      },
      status: RESULT_STATUS_SUCCESS,
    });
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});
