import { type OBFUSCATION_SIGNALS } from './constants';

export type ObfuscationSignal = (typeof OBFUSCATION_SIGNALS)[number];

export type TextObfuscationTag = {
  readonly hasObfuscation: boolean;
  readonly signals: readonly ObfuscationSignal[];
};
