import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';
import {
  type Result,
  type ResultError,
  RESULT_STATUS_ERROR,
  RESULT_STATUS_SUCCESS,
} from '@jearle/util-result';

import { createTemplateClient } from '.';
import {
  type TemplateAnalyzeResult,
  type TemplateClientOptions,
  type TemplateRenderOptions,
  type TemplateRenderResult,
  TEMPLATE_INVALID_MEMORY_LIMIT_ERROR,
  TEMPLATE_INVALID_OPTIONS_ERROR_CODE,
  TEMPLATE_INVALID_PARSE_LIMIT_ERROR,
  TEMPLATE_INVALID_RENDER_LIMIT_ERROR,
  TEMPLATE_INVALID_TEMPLATE_LIMIT_ERROR,
  TEMPLATE_MISSING_VARIABLE_ERROR_CODE,
  TEMPLATE_PARSE_ERROR_CODE,
} from '..';

type ExpectSuccessResultProps<TData> = {
  readonly result: Result<TData>;
};

const expectSuccessResult = <TData>(props: ExpectSuccessResultProps<TData>) => {
  const { result } = props;

  expect(result.status).toBe(RESULT_STATUS_SUCCESS);

  if (result.status !== RESULT_STATUS_SUCCESS) {
    expect.unreachable();
  }

  return result.data;
};

type ExpectErrorResultProps<TData> = {
  readonly result: Result<TData>;
};

const expectErrorResult = <TData>(props: ExpectErrorResultProps<TData>) => {
  const { result } = props;

  expect(result.status).toBe(RESULT_STATUS_ERROR);

  if (result.status !== RESULT_STATUS_ERROR) {
    expect.unreachable();
  }

  const error: ResultError = result.error;

  return error;
};

test(`templateClient.render(...) renders a template with data`, async () => {
  const { templateClient } = createTemplateClient();
  const result: TemplateRenderResult = await templateClient.render(
    `Hello {{ user.name }}`,
    {
      user: {
        name: `Ada`,
      },
    },
  );
  const renderedTemplate = expectSuccessResult({ result });

  expect(renderedTemplate).toBe(`Hello Ada`);
});

test(`templateClient.render(...) returns an error for missing variables`, async () => {
  const { templateClient } = createTemplateClient();
  const result = await templateClient.render(`Hello {{ user.name }}`, {});
  const error = expectErrorResult({ result });

  expect(error.code).toBe(TEMPLATE_MISSING_VARIABLE_ERROR_CODE);
});

test(`templateClient.render(...) returns an error for invalid templates`, async () => {
  const { templateClient } = createTemplateClient();
  const result = await templateClient.render(`Hello {{ name `, {
    name: `Ada`,
  });
  const error = expectErrorResult({ result });

  expect(error.code).toBe(TEMPLATE_PARSE_ERROR_CODE);
});

test(`createTemplateClient({ limits }) returns field-specific option errors`, async () => {
  type TestCasesItem = {
    readonly expectedMessage: string;
    readonly options: TemplateClientOptions;
  };

  const testCases: readonly TestCasesItem[] = [
    {
      expectedMessage: TEMPLATE_INVALID_MEMORY_LIMIT_ERROR,
      options: {
        memoryLimit: 0,
      },
    },
    {
      expectedMessage: TEMPLATE_INVALID_PARSE_LIMIT_ERROR,
      options: {
        parseLimit: 0,
      },
    },
    {
      expectedMessage: TEMPLATE_INVALID_RENDER_LIMIT_ERROR,
      options: {
        renderLimit: 0,
      },
    },
    {
      expectedMessage: TEMPLATE_INVALID_TEMPLATE_LIMIT_ERROR,
      options: {
        templateLimit: 0,
      },
    },
  ];

  for (const testCase of testCases) {
    const { templateClient } = createTemplateClient(testCase.options);
    const result = await templateClient.render(`Hello`, {});
    const error = expectErrorResult({ result });

    expect(error.code).toBe(TEMPLATE_INVALID_OPTIONS_ERROR_CODE);
    expect(error.message).toBe(testCase.expectedMessage);
  }
});

test(`templateClient.render(..., options) returns field-specific option errors`, async () => {
  type TestCasesItem2 = {
    readonly expectedMessage: string;
    readonly options: TemplateRenderOptions;
  };

  const testCases: readonly TestCasesItem2[] = [
    {
      expectedMessage: TEMPLATE_INVALID_MEMORY_LIMIT_ERROR,
      options: {
        memoryLimit: 0,
      },
    },
    {
      expectedMessage: TEMPLATE_INVALID_RENDER_LIMIT_ERROR,
      options: {
        renderLimit: 0,
      },
    },
    {
      expectedMessage: TEMPLATE_INVALID_TEMPLATE_LIMIT_ERROR,
      options: {
        templateLimit: 0,
      },
    },
  ];
  const { templateClient } = createTemplateClient();

  for (const testCase of testCases) {
    const result = await templateClient.render(`Hello`, {}, testCase.options);
    const error = expectErrorResult({ result });

    expect(error.code).toBe(TEMPLATE_INVALID_OPTIONS_ERROR_CODE);
    expect(error.message).toBe(testCase.expectedMessage);
  }
});

test(`templateClient.render(...) supports Liquid filters without exposing LiquidJS`, async () => {
  const { templateClient } = createTemplateClient({
    filters: {
      shout: (value, suffix = `!`) => {
        const renderedValue = String(value).toUpperCase();
        const renderedSuffix = String(suffix);
        const result = `${renderedValue}${renderedSuffix}`;

        return result;
      },
    },
  });
  const result = await templateClient.render(
    `{{ name | upcase }} {{ name | shout: "?" }}`,
    {
      name: `Ada`,
    },
  );
  const renderedTemplate = expectSuccessResult({ result });

  expect(renderedTemplate).toBe(`ADA ADA?`);
});

test(`templateClient.analyze(...) returns referenced global variables`, () => {
  const { templateClient } = createTemplateClient();
  const result: TemplateAnalyzeResult = templateClient.analyze(
    [
      `{% assign label = user.name %}`,
      `{{ label }}`,
      `{{ project.id }}`,
      `{% for item in items %}{{ item.title }}{% endfor %}`,
    ].join(` `),
  );
  const analysis = expectSuccessResult({ result });

  expect(analysis.variables).toEqual([`items`, `project.id`, `user.name`]);
});

test(`templateClient.renderFile(...) renders a template file`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-template-`));

  try {
    const filePath = path.join(directoryPath, `message.liquid`);

    await writeFile(filePath, `File {{ name | upcase }}`);

    const { templateClient } = createTemplateClient({
      root: directoryPath,
    });
    const result = await templateClient.renderFile(`message.liquid`, {
      name: `Ada`,
    });
    const renderedTemplate = expectSuccessResult({ result });

    expect(renderedTemplate).toBe(`File ADA`);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});
