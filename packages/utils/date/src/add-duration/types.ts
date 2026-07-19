import { type Unit } from '../units';

export type DurationString = `${number}${Unit}`;

export type AddDurationOptions = {
  readonly fromDate?: Date;
};
