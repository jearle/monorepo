import { normalizeText } from '../text-metrics';
import {
  DIRECT_REQUEST_PATTERN,
  HYPOTHETICAL_FRAME_PATTERN,
  INSTRUCTIONAL_FRAME_PATTERN,
  NARRATIVE_FRAME_DIRECT_REQUEST,
  NARRATIVE_FRAME_EMPTY,
  NARRATIVE_FRAME_HYPOTHETICAL,
  NARRATIVE_FRAME_INSTRUCTIONAL,
  NARRATIVE_FRAME_QUESTION,
  NARRATIVE_FRAME_QUOTED_SPEECH,
  NARRATIVE_FRAME_ROLEPLAY,
  NARRATIVE_FRAME_STATEMENT,
  NARRATIVE_FRAME_STORY,
  QUOTED_SPEECH_PATTERN,
  ROLEPLAY_FRAME_PATTERN,
  STORY_FRAME_PATTERN,
} from './constants';
import { type NarrativeFrameTag } from './types';

const checkHasQuotedSpeech = (text: string) => {
  const result = QUOTED_SPEECH_PATTERN.test(text);

  return result;
};

const checkHasHypotheticalFrame = (text: string) => {
  const result = HYPOTHETICAL_FRAME_PATTERN.test(text);

  return result;
};

const checkHasRoleplayFrame = (text: string) => {
  const result = ROLEPLAY_FRAME_PATTERN.test(text);

  return result;
};

const checkHasStoryFrame = (text: string) => {
  const result = STORY_FRAME_PATTERN.test(text);

  return result;
};

const checkHasDirectRequest = (text: string) => {
  const result = DIRECT_REQUEST_PATTERN.test(text);

  return result;
};

const checkHasInstructionalFrame = (text: string) => {
  const result = INSTRUCTIONAL_FRAME_PATTERN.test(text);

  return result;
};
type GetNarrativeFrameProps = {
  readonly hasText: boolean;
  readonly hasQuotedSpeech: boolean;
  readonly hasHypotheticalFrame: boolean;
  readonly hasDirectRequest: boolean;
  readonly hasInstructionalFrame: boolean;
  readonly hasQuestion: boolean;
  readonly hasRoleplayFrame: boolean;
  readonly hasStoryFrame: boolean;
};

const getNarrativeFrame = (props: GetNarrativeFrameProps) => {
  const {
    hasText,
    hasQuotedSpeech,
    hasHypotheticalFrame,
    hasDirectRequest,
    hasInstructionalFrame,
    hasQuestion,
    hasRoleplayFrame,
    hasStoryFrame,
  } = props;

  if (hasText === false) {
    return NARRATIVE_FRAME_EMPTY;
  }

  if (hasQuotedSpeech) {
    return NARRATIVE_FRAME_QUOTED_SPEECH;
  }

  if (hasRoleplayFrame) {
    return NARRATIVE_FRAME_ROLEPLAY;
  }

  if (hasStoryFrame) {
    return NARRATIVE_FRAME_STORY;
  }

  if (hasHypotheticalFrame) {
    return NARRATIVE_FRAME_HYPOTHETICAL;
  }

  if (hasDirectRequest) {
    return NARRATIVE_FRAME_DIRECT_REQUEST;
  }

  if (hasInstructionalFrame) {
    return NARRATIVE_FRAME_INSTRUCTIONAL;
  }

  if (hasQuestion) {
    return NARRATIVE_FRAME_QUESTION;
  }

  return NARRATIVE_FRAME_STATEMENT;
};

export type TagTextNarrativeFrameProps = {
  readonly text: string;
};

export const tagTextNarrativeFrame = (props: TagTextNarrativeFrameProps) => {
  const { text } = props;
  const normalizedText = normalizeText({ text });
  const hasText = normalizedText.length > 0;
  const hasQuotedSpeech = checkHasQuotedSpeech(normalizedText);
  const hasRoleplayFrame = checkHasRoleplayFrame(normalizedText);
  const hasStoryFrame = checkHasStoryFrame(normalizedText);
  const hasHypotheticalFrame = checkHasHypotheticalFrame(normalizedText);
  const hasDirectRequest = checkHasDirectRequest(normalizedText);
  const hasInstructionalFrame = checkHasInstructionalFrame(normalizedText);
  const hasQuestion = normalizedText.includes(`?`);
  const frame = getNarrativeFrame({
    hasText,
    hasQuotedSpeech,
    hasHypotheticalFrame,
    hasDirectRequest,
    hasInstructionalFrame,
    hasQuestion,
    hasRoleplayFrame,
    hasStoryFrame,
  });
  const tag: NarrativeFrameTag = {
    frame,
    hasDirectRequest,
    hasHypotheticalFrame,
    hasInstructionalFrame,
    hasQuestion,
    hasQuotedSpeech,
    hasRoleplayFrame,
    hasStoryFrame,
  };
  const result = tag;

  return result;
};
