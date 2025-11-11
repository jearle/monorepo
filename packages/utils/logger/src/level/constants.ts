export const LEVEL_FATAL = `fatal` as const;
export const LEVEL_ERROR = `error` as const;
export const LEVEL_WARN = `warn` as const;
export const LEVEL_INFO = `info` as const;
export const LEVEL_DEBUG = `debug` as const;
export const LEVEL_TRACE = `trace` as const;

export const LEVELS = [
  LEVEL_FATAL,
  LEVEL_ERROR,
  LEVEL_WARN,
  LEVEL_INFO,
  LEVEL_DEBUG,
  LEVEL_TRACE,
] as const;
