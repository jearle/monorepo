import { expect, test } from 'bun:test';

import {
  PARSE_JSONL_CONTENT_ISSUE_CODE_BLANK_LINE,
  PARSE_JSONL_CONTENT_ISSUE_CODE_INVALID_JSON,
  parseJsonlContent,
} from '.';

test(`parseJsonlContent parses newline-terminated JSONL`, () => {
  const result = parseJsonlContent({
    content: `{"a":1}
{"b":2}
`,
  });

  expect(result.success).toBeTrue();

  if (result.success === false) {
    expect.unreachable();
  }

  expect(result.lines).toEqual([`{"a":1}`, `{"b":2}`]);
  expect(result.values).toEqual([
    {
      a: 1,
    },
    {
      b: 2,
    },
  ]);
});

test(`parseJsonlContent parses JSONL without trailing newline`, () => {
  const result = parseJsonlContent({
    content: `{"code":"value","lineNumber":1,"message":"not an issue"}`,
  });

  expect(result.success).toBeTrue();

  if (result.success === false) {
    expect.unreachable();
  }

  expect(result.lines).toEqual([
    `{"code":"value","lineNumber":1,"message":"not an issue"}`,
  ]);
  expect(result.values).toEqual([
    {
      code: `value`,
      lineNumber: 1,
      message: `not an issue`,
    },
  ]);
});

test(`parseJsonlContent accepts empty content`, () => {
  const result = parseJsonlContent({
    content: ``,
  });

  expect(result.success).toBeTrue();

  if (result.success === false) {
    expect.unreachable();
  }

  expect(result.lines).toEqual([]);
  expect(result.values).toEqual([]);
});

test(`parseJsonlContent rejects blank interior lines`, () => {
  const result = parseJsonlContent({
    content: `{"a":1}

{"b":2}
`,
  });

  expect(result.success).toBeFalse();

  if (result.success === true) {
    expect.unreachable();
  }

  expect(result.issues).toEqual([
    {
      code: PARSE_JSONL_CONTENT_ISSUE_CODE_BLANK_LINE,
      lineNumber: 2,
      message: `JSONL line 2 is blank.`,
    },
  ]);
});

test(`parseJsonlContent rejects whitespace-only lines as blank`, () => {
  const result = parseJsonlContent({
    content: `{"a":1}
   
{"b":2}
`,
  });

  expect(result.success).toBeFalse();

  if (result.success === true) {
    expect.unreachable();
  }

  expect(result.issues).toEqual([
    {
      code: PARSE_JSONL_CONTENT_ISSUE_CODE_BLANK_LINE,
      lineNumber: 2,
      message: `JSONL line 2 is blank.`,
    },
  ]);
});

test(`parseJsonlContent rejects extra trailing blank lines`, () => {
  const result = parseJsonlContent({
    content: `{"a":1}

`,
  });

  expect(result.success).toBeFalse();

  if (result.success === true) {
    expect.unreachable();
  }

  expect(result.issues[0]?.code).toBe(
    PARSE_JSONL_CONTENT_ISSUE_CODE_BLANK_LINE,
  );
  expect(result.issues[0]?.lineNumber).toBe(2);
});

test(`parseJsonlContent reports invalid JSON lines`, () => {
  const result = parseJsonlContent({
    content: `{"a":1}
not json
`,
  });

  expect(result.success).toBeFalse();

  if (result.success === true) {
    expect.unreachable();
  }

  expect(result.issues[0]?.code).toBe(
    PARSE_JSONL_CONTENT_ISSUE_CODE_INVALID_JSON,
  );
  expect(result.issues[0]?.lineNumber).toBe(2);
  expect(result.issues[0]?.message).toContain(`JSONL line 2 is not valid JSON`);
});

test(`parseJsonlContent reports multiple issues`, () => {
  const result = parseJsonlContent({
    content: `{"a":1}

not json
`,
  });

  expect(result.success).toBeFalse();

  if (result.success === true) {
    expect.unreachable();
  }

  expect(result.issues.map((issue) => issue.code)).toEqual([
    PARSE_JSONL_CONTENT_ISSUE_CODE_BLANK_LINE,
    PARSE_JSONL_CONTENT_ISSUE_CODE_INVALID_JSON,
  ]);
  expect(result.issues.map((issue) => issue.lineNumber)).toEqual([2, 3]);
});
