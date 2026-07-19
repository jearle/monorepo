# JSONL Utility

Deterministic helpers for newline-delimited JSON content.

`@jearle/util-jsonl` owns generic JSONL line serialization and content
construction only. It reuses `@jearle/util-json` `stableStringify` for stable JSON
object-key ordering and preserves input array order when constructing content.
