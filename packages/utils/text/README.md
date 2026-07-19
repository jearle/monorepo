# Text Utilities

Shared deterministic text metrics and taggers.

## Features

- `text-metrics`: normalization, tokenization, and simple text counts.
- `text-casing`: casing-style detection for prose, delimited names, and common
  identifier casing.
- `text-offensiveness`: deterministic lexical tags using `cuss` as a base plus
  compact Monorepo-owned supplemental terms.
- `informal-writing`: casual wording, slang, acronym, punctuation, emoticon, and
  offensiveness signals.
- `text-narrative-frame`: request, hypothetical, question, quotation, and
  statement framing.
- `text-obfuscation`: leetspeak, symbol substitution, spaced-word, and
  zero-width character signals.
- `text-point-of-view`: first, second, third, mixed, and unknown point-of-view
  tags from pronoun counts.

## Lexical Source Notes

The supplemental lexical constants are Monorepo-owned, manually curated category
samples. Source categories consulted on 2026-06-06 include the `cuss` README,
TSPA abuse taxonomy/glossary, ADL hate-symbol guidance, GLAAD anti-LGBTQ online
hate guide, GARM brand-safety framework, Merriam-Webster Slang & Trending,
Dictionary.com Slang, Cambridge Dictionary updates, Pew teen/social media
context, and Wiktionary as a license-aware cross-check.

Do not bulk-copy third-party dictionaries, ADL tables, Wiktionary pages, or
proprietary examples into this package. Prefer dated category notes and compact
manual constants that can be reviewed for false positives.
