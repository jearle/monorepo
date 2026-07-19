import { type TEXT_OFFENSIVENESS_SIGNALS } from './constants';

export type TextOffensivenessSignal =
  (typeof TEXT_OFFENSIVENESS_SIGNALS)[number];

export type TextOffensivenessTag = {
  readonly cussTermCount: number;
  readonly hasOffensiveLanguage: boolean;
  readonly matchedTerms: readonly string[];
  readonly signals: readonly TextOffensivenessSignal[];
  readonly supplementalTermCount: number;
};
