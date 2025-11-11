export type NewEntity = {
  readonly [key: string]: unknown;
};
export type ExistingEntity = {
  readonly id: string;
  readonly deletedAt?: true;
};
