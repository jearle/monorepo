import {
  RUNTIME_BUN,
  RUNTIME_DENO,
  RUNTIME_NODE,
  RUNTIME_UNKNOWN,
  RUNTIME_WEB,
  RUNTIME_WORKER,
} from './constants';
import { type GetRunTimeResult } from './types';

type DenoRuntimeVersion = {
  readonly deno?: string;
};

declare global {
  interface Deno {
    readonly version?: DenoRuntimeVersion;
  }

  var Deno: Deno | undefined;
}

export const getRuntime = (): GetRunTimeResult => {
  const isRuntimeBun = typeof globalThis.Bun?.version === `string`;

  if (isRuntimeBun === true) {
    const result = { runtime: RUNTIME_BUN };

    return result;
  }

  const isRuntimeDeno = typeof globalThis.Deno?.version?.deno === `string`;
  if (isRuntimeDeno === true) {
    const result = { runtime: RUNTIME_DENO };

    return result;
  }

  const isRuntimeNode = typeof globalThis.process?.versions?.node === `string`;
  if (isRuntimeNode === true) {
    const result = { runtime: RUNTIME_NODE };

    return result;
  }

  const isRuntimeWorker =
    typeof globalThis.self !== `undefined` &&
    typeof globalThis.addEventListener === `function` &&
    !(`window` in globalThis);
  if (isRuntimeWorker === true) {
    const result = { runtime: RUNTIME_WORKER };

    return result;
  }
  const isRuntimeWeb =
    typeof globalThis.window !== `undefined` &&
    typeof globalThis.document !== `undefined`;
  if (isRuntimeWeb) {
    const result = { runtime: RUNTIME_WEB };

    return result;
  }

  const result = { runtime: RUNTIME_UNKNOWN };

  return result;
};
