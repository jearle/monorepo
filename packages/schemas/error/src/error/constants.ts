export const ERROR_KIND_VALIDATION = `validation` as const;
export const ERROR_KIND_UNAUTHENTICATED = `unauthenticated` as const;
export const ERROR_KIND_FORBIDDEN = `forbidden` as const;
export const ERROR_KIND_NOT_FOUND = `not-found` as const;
export const ERROR_KIND_CONFLICT = `conflict` as const;
export const ERROR_KIND_RATE_LIMITED = `rate-limited` as const;
export const ERROR_KIND_INTERNAL = `internal` as const;

export const ERROR_KINDS = [
  ERROR_KIND_VALIDATION,
  ERROR_KIND_UNAUTHENTICATED,
  ERROR_KIND_FORBIDDEN,
  ERROR_KIND_NOT_FOUND,
  ERROR_KIND_CONFLICT,
  ERROR_KIND_RATE_LIMITED,
  ERROR_KIND_INTERNAL,
] as const;
