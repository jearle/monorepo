import { expect, test } from 'bun:test';

import {
  OBFUSCATION_SIGNAL_LEETSPEAK,
  OBFUSCATION_SIGNAL_SPACED_WORD,
  OBFUSCATION_SIGNAL_SYMBOL_SUBSTITUTION,
  OBFUSCATION_SIGNAL_ZERO_WIDTH,
  tagTextObfuscation,
} from '.';

test(`tags leetspeak and obfuscation signals`, () => {
  const result = tagTextObfuscation({
    text: `p@ssw0rd h a c k`,
  });

  expect(result.hasObfuscation).toBe(true);
  expect(result.signals).toContain(OBFUSCATION_SIGNAL_LEETSPEAK);
  expect(result.signals).toContain(OBFUSCATION_SIGNAL_SYMBOL_SUBSTITUTION);
  expect(result.signals).toContain(OBFUSCATION_SIGNAL_SPACED_WORD);
});

test(`tags zero-width obfuscation`, () => {
  const result = tagTextObfuscation({
    text: `pass\u200Bword`,
  });

  expect(result.hasObfuscation).toBe(true);
  expect(result.signals).toContain(OBFUSCATION_SIGNAL_ZERO_WIDTH);
});
