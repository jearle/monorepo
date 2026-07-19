# @jearle/util-http

Fetch-shaped HTTP client utilities for Monorepo packages.

## Public client

```ts
const { httpClient } = createHttpClient({
  baseUrl: 'https://api.example.test',
  headers: {
    authorization: `Bearer ${token}`,
  },
  timeoutMs: 10_000,
  maxAttempts: 3,
});

const responseResult = await httpClient.fetch('/resources');
const jsonResult = await httpClient.fetchJson<{ readonly ok: boolean }>(
  '/resources',
  {
    method: 'POST',
    json: {
      value: 'hello',
    },
  },
);
```

## Defaults

Call `createHttpClient()` with no arguments for the default Monorepo HTTP behavior.

```ts
const { httpClient } = createHttpClient();

const result = await httpClient.fetch('https://example.test/resources');
```

This is still backed by `ky` and still returns Monorepo `Result` values. Use raw
`globalThis.fetch(...)` only when you do not want Monorepo Result semantics.

## Result handling

Both client methods return Monorepo `Result` values.

```ts
const result = await httpClient.fetch('/resources');

if (result.status === 'ERROR') {
  console.error(result.error);
  return;
}

const response = result.data;
```

## `fetch` vs `fetchJson`

Use `fetch(...)` when the caller wants the native `Response`.

Use `fetchJson(...)` when the caller expects a successful JSON response. It
returns Monorepo data shaped as `{ json, response }`, where `response` is the native
Fetch `Response`.

`fetchJson(...)` also accepts a `json` request option. The client stringifies it
with `@jearle/util-json`, sets `content-type: application/json` when no content
type is already present, and returns `HTTP_INVALID_REQUEST_JSON` if the request
body cannot be stringified.

```ts
const result = await httpClient.fetchJson('/resources', {
  method: 'POST',
  json: {
    value: 'hello',
  },
});
```

## Aborting requests

Use the standard Fetch `AbortController` and pass its signal through `init`.

```ts
const controller = new AbortController();

const resultPromise = httpClient.fetch('/resources', {
  signal: controller.signal,
});

controller.abort();

const result = await resultPromise;
```

The same pattern works for `fetchJson(...)`.

```ts
const controller = new AbortController();

const resultPromise = httpClient.fetchJson('/resources', {
  signal: controller.signal,
});

controller.abort();

const result = await resultPromise;
```

## Runtime rules

- `httpClient.fetch(input, init?)` uses the standard fetch argument shape and returns `Result<Response>`.
- `httpClient.fetchJson(input, init?)` uses the fetch argument shape plus an optional `json` request body, checks the standard Fetch `response.ok` flag (`true` for 2xx statuses), parses JSON, and returns `Result<{ json, response }>`.
- Non-2xx responses are successful transport results from `fetch(...)` and `HTTP_STATUS` errors from `fetchJson(...)`.
- Timeout, abort, transport, status, JSON, body-read, and option failures use Monorepo `Result` errors.
- Base URL, default headers, injected fetch, timeout, retry, and hooks are configured on `createHttpClient(...)` and backed by `ky`.
- Timeout can be disabled with `timeoutMs: false`.
- SSE parsing remains in `@jearle/util-sse`.
