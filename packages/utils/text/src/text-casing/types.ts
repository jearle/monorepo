import { type TEXT_CASING_STYLES } from './constants';

export type TextCasingStyle = (typeof TEXT_CASING_STYLES)[number];

export type TextCasingTag = {
  readonly style: TextCasingStyle;
};
