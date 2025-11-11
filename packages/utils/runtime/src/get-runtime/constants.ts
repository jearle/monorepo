export const RUNTIME_BUN = `bun` as const;
export const RUNTIME_DENO = `deno` as const;
export const RUNTIME_NODE = `node` as const;
export const RUNTIME_WORKER = `worker` as const;
export const RUNTIME_WEB = `web` as const;
export const RUNTIME_UNKNOWN = `unknown` as const;

export const RUNTIMES = [
  RUNTIME_BUN,
  RUNTIME_DENO,
  RUNTIME_NODE,
  RUNTIME_WORKER,
  RUNTIME_WEB,
  RUNTIME_UNKNOWN,
] as const;
