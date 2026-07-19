# embeddings

Local CPU text embeddings utilities for pilot similarity work.

## Manual verification

Run a real-model smoke check only when you want to download and execute a local model:

`RUN_LOCAL_EMBEDDINGS_SMOKE_TEST=true bun test packages/utils/embeddings/src/hugging-face-embeddings/create-hugging-face-embeddings.smoke.test.ts`
