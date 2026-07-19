import { type NARRATIVE_FRAMES } from './constants';

export type NarrativeFrame = (typeof NARRATIVE_FRAMES)[number];

export type NarrativeFrameTag = {
  readonly frame: NarrativeFrame;
  readonly hasDirectRequest: boolean;
  readonly hasHypotheticalFrame: boolean;
  readonly hasInstructionalFrame: boolean;
  readonly hasQuestion: boolean;
  readonly hasQuotedSpeech: boolean;
  readonly hasRoleplayFrame: boolean;
  readonly hasStoryFrame: boolean;
};
