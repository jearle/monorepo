import { type TextOffensivenessTag } from '../text-offensiveness';
import { type INFORMAL_WRITING_SIGNALS } from './constants';

export type InformalWritingSignal = (typeof INFORMAL_WRITING_SIGNALS)[number];

export type InformalWritingTag = {
  readonly isInformal: boolean;
  readonly offensiveness: TextOffensivenessTag;
  readonly signals: readonly InformalWritingSignal[];
};
