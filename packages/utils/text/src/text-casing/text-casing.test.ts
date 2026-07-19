import { expect, test } from 'bun:test';

import {
  TEXT_CASING_STYLE_CAMEL_CASE,
  TEXT_CASING_STYLE_CONSTANT_CASE,
  TEXT_CASING_STYLE_EMPTY,
  TEXT_CASING_STYLE_KEBAB_CASE,
  TEXT_CASING_STYLE_MIXED_CASE,
  TEXT_CASING_STYLE_PASCAL_CASE,
  TEXT_CASING_STYLE_SENTENCE_CASE,
  TEXT_CASING_STYLE_SNAKE_CASE,
  TEXT_CASING_STYLE_TITLE_CASE,
  TEXT_CASING_STYLE_UPPERCASE,
  tagTextCasing,
} from '.';

test(`tags phrase casing styles`, () => {
  expect(tagTextCasing({ text: `` })).toEqual({
    style: TEXT_CASING_STYLE_EMPTY,
  });
  expect(tagTextCasing({ text: `LOUD WARNING` })).toEqual({
    style: TEXT_CASING_STYLE_UPPERCASE,
  });
  expect(tagTextCasing({ text: `Quiet Title Case` })).toEqual({
    style: TEXT_CASING_STYLE_TITLE_CASE,
  });
  expect(tagTextCasing({ text: `Sentence case text` })).toEqual({
    style: TEXT_CASING_STYLE_SENTENCE_CASE,
  });
  expect(tagTextCasing({ text: `mIxEd CASE text` })).toEqual({
    style: TEXT_CASING_STYLE_MIXED_CASE,
  });
});

test(`tags identifier and delimited casing styles`, () => {
  expect(tagTextCasing({ text: `quietTitleCase` })).toEqual({
    style: TEXT_CASING_STYLE_CAMEL_CASE,
  });
  expect(tagTextCasing({ text: `QuietTitleCase` })).toEqual({
    style: TEXT_CASING_STYLE_PASCAL_CASE,
  });
  expect(tagTextCasing({ text: `quiet-title-case` })).toEqual({
    style: TEXT_CASING_STYLE_KEBAB_CASE,
  });
  expect(tagTextCasing({ text: `quiet_title_case` })).toEqual({
    style: TEXT_CASING_STYLE_SNAKE_CASE,
  });
  expect(tagTextCasing({ text: `QUIET_TITLE_CASE` })).toEqual({
    style: TEXT_CASING_STYLE_CONSTANT_CASE,
  });
});
