import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
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

test(`renderSource(...) resolves supported imports from their authored paths`, async () => {
  const directoryPath = await mkdtemp(
    path.join(tmpdir(), `monorepo-source-imports-`),
  );

  try {
    const configPath = path.join(directoryPath, `config`);
    const nestedPath = path.join(configPath, `nested`);
    const partialsPath = path.join(configPath, `partials`);
    const sharedPath = path.join(directoryPath, `shared`);

    await Promise.all([
      mkdir(nestedPath, { recursive: true }),
      mkdir(partialsPath, { recursive: true }),
      mkdir(sharedPath, { recursive: true }),
    ]);

    const template = [
      `{% assign localName = "outer" %}`,
      `{% include "partials/greeting" %}|`,
      `{% render "./card", localName: person.name %}|`,
      `{% include "./nested/outer" %}|`,
      `{% include "../shared/footer" %}|`,
      `{% include dynamicPartial %}`,
    ].join(``);
    const sourcePath = path.join(configPath, `message.templ`);

    await Promise.all([
      writeFile(sourcePath, template),
      writeFile(
        path.join(partialsPath, `greeting.templ`),
        `Hello {{ person.name }}`,
      ),
      writeFile(path.join(configPath, `card.templ`), `Card {{ localName }}`),
      writeFile(
        path.join(nestedPath, `outer.templ`),
        `Nested {% include "./inner" %}`,
      ),
      writeFile(path.join(nestedPath, `inner.templ`), `import`),
      writeFile(path.join(sharedPath, `footer.templ`), `Parent`),
      writeFile(path.join(configPath, `dynamic.templ`), `Dynamic`),
    ]);

    const { templateClient } = createTemplateClient({ extname: `.templ` });
    const data = {
      dynamicPartial: `./dynamic`,
      person: { name: `Ada` },
    };
    const result = await templateClient.renderSource(
      { sourcePath, template },
      data,
    );

    expect(expectSuccess(result)).toBe(
      `Hello Ada|Card Ada|Nested import|Parent|Dynamic`,
    );
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});

test(`renderSource(...) resolves layout imports from the authored path`, async () => {
  const directoryPath = await mkdtemp(
    path.join(tmpdir(), `monorepo-source-layout-`),
  );

  try {
    const template = [
      `{% layout "./frame" %}`,
      `{% block body %}Body{% endblock %}`,
    ].join(``);
    const sourcePath = path.join(directoryPath, `message.templ`);

    await Promise.all([
      writeFile(sourcePath, template),
      writeFile(
        path.join(directoryPath, `frame.templ`),
        `Before[{% block body %}default{% endblock %}]After {{ title }}`,
      ),
    ]);

    const { templateClient } = createTemplateClient({ extname: `.templ` });
    const result = await templateClient.renderSource(
      { sourcePath, template },
      { title: `Title` },
    );

    expect(expectSuccess(result)).toBe(`Before[Body]After Title`);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});
