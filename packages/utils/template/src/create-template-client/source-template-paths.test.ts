import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';
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

test(`renderSource(...) resolves imports through a canonical source symlink`, async () => {
  const directoryPath = await mkdtemp(
    path.join(tmpdir(), `monorepo-source-symlink-`),
  );

  try {
    const realPath = path.join(directoryPath, `real`);
    const linkPath = path.join(directoryPath, `linked`);
    const template = `{% include "./common" %}`;

    await mkdir(realPath);
    await Promise.all([
      writeFile(path.join(realPath, `message.templ`), template),
      writeFile(path.join(realPath, `common.templ`), `canonical`),
    ]);
    await symlink(realPath, linkPath, `dir`);

    const { templateClient } = createTemplateClient({ extname: `.templ` });
    const result = await templateClient.renderSource(
      { sourcePath: path.join(linkPath, `message.templ`), template },
      {},
    );

    expect(expectSuccess(result)).toBe(`canonical`);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});

test(`source rendering isolates repeated import names by canonical path`, async () => {
  const directoryPath = await mkdtemp(
    path.join(tmpdir(), `monorepo-source-cache-`),
  );

  try {
    const firstPath = path.join(directoryPath, `first`);
    const secondPath = path.join(directoryPath, `second`);
    const template = `{% include "common" %}`;

    await Promise.all([mkdir(firstPath), mkdir(secondPath)]);
    await Promise.all([
      writeFile(path.join(firstPath, `message.templ`), template),
      writeFile(path.join(firstPath, `common.templ`), `{{ first }}`),
      writeFile(path.join(secondPath, `message.templ`), template),
      writeFile(path.join(secondPath, `common.templ`), `{{ second }}`),
    ]);

    const { templateClient } = createTemplateClient({ extname: `.templ` });
    const firstSource = {
      sourcePath: path.join(firstPath, `message.templ`),
      template,
    };
    const secondSource = {
      sourcePath: path.join(secondPath, `message.templ`),
      template,
    };
    const firstRender = await templateClient.renderSource(firstSource, {
      first: `one`,
    });
    const secondRender = await templateClient.renderSource(secondSource, {
      second: `two`,
    });

    expect(expectSuccess(firstRender)).toBe(`one`);
    expect(expectSuccess(secondRender)).toBe(`two`);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});

test(`source parsing and rendering isolate nested canonical imports`, async () => {
  const directoryPath = await mkdtemp(
    path.join(tmpdir(), `monorepo-source-canonical-analysis-`),
  );

  try {
    const firstPath = path.join(directoryPath, `first`);
    const secondPath = path.join(directoryPath, `second`);
    const sourcePath = path.join(directoryPath, `message.templ`);
    const template = [
      `{% include "./first/main" %}`,
      `{% include "./second/main" %}`,
    ].join(``);

    await Promise.all([mkdir(firstPath), mkdir(secondPath)]);
    await Promise.all([
      writeFile(sourcePath, template),
      writeFile(path.join(firstPath, `main.templ`), `{% include "./common" %}`),
      writeFile(path.join(firstPath, `common.templ`), `{{ first.value }}`),
      writeFile(
        path.join(secondPath, `main.templ`),
        `{% include "./common" %}`,
      ),
      writeFile(path.join(secondPath, `common.templ`), `{{ second.value }}`),
    ]);

    const { templateClient } = createTemplateClient({ extname: `.templ` });
    const source = { sourcePath, template };
    const parsed = await templateClient.parseSource(source);
    const rendered = await templateClient.renderSource(source, {
      first: { value: 1 },
      second: { value: 2 },
    });

    expect(expectSuccess(parsed).hasFileImports).toBe(true);
    expect(expectSuccess(rendered)).toBe(`12`);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});

test(`renderSource(...) is independent of the process working directory`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-source-cwd-`));

  try {
    const partialsPath = path.join(directoryPath, `partials`);
    const otherPath = path.join(directoryPath, `other`);
    const sourcePath = path.join(directoryPath, `message.templ`);
    const template = `{% include "shared" %}`;

    await Promise.all([mkdir(partialsPath), mkdir(otherPath)]);
    await Promise.all([
      writeFile(sourcePath, template),
      writeFile(path.join(partialsPath, `shared.templ`), `stable`),
    ]);

    const packagePath = path.resolve(import.meta.dir, `../..`);
    const relativePartialsPath = path.relative(packagePath, partialsPath);
    const script = [
      `import { createTemplateClient } from "@jearle/util-template";`,
      `const created = createTemplateClient({ extname: ".templ", partials: ${JSON.stringify(relativePartialsPath)} });`,
      `process.chdir(${JSON.stringify(otherPath)});`,
      `const result = await created.templateClient.renderSource({ sourcePath: ${JSON.stringify(sourcePath)}, template: ${JSON.stringify(template)} }, {});`,
      `if (result.status !== "SUCCESS") process.exit(1);`,
      `process.stdout.write(result.data);`,
    ].join(`\n`);
    const subprocess = Bun.spawn([process.execPath, `-e`, script], {
      cwd: packagePath,
      stderr: `pipe`,
      stdout: `pipe`,
    });
    const [exitCode, output] = await Promise.all([
      subprocess.exited,
      new Response(subprocess.stdout).text(),
    ]);

    expect(exitCode).toBe(0);
    expect(output).toBe(`stable`);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});
