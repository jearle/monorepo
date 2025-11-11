export const HEALTH_STATUS_OK = `health-status-ok`;
export const HEALTH_STATUS_DEGRADED = `health-status-degraded`;
export const HEALTH_STATUS_DOWN = `health-status-down`;
export const HEALTH_STATUSES = [
  HEALTH_STATUS_OK,
  HEALTH_STATUS_DEGRADED,
  HEALTH_STATUS_DOWN,
] as const;
