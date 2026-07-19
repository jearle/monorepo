export const SESSION_STATE_ACTIVE = `active` as const;
export const SESSION_STATE_CLOSED = `closed` as const;
export const SESSION_STATE_ARCHIVED = `archived` as const;

export const SESSION_STATES = [
  SESSION_STATE_ACTIVE,
  SESSION_STATE_CLOSED,
  SESSION_STATE_ARCHIVED,
] as const;
