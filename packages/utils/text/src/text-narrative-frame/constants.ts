export const NARRATIVE_FRAME_DIRECT_REQUEST = `DIRECT_REQUEST`;
export const NARRATIVE_FRAME_EMPTY = `EMPTY`;
export const NARRATIVE_FRAME_HYPOTHETICAL = `HYPOTHETICAL`;
export const NARRATIVE_FRAME_INSTRUCTIONAL = `INSTRUCTIONAL`;
export const NARRATIVE_FRAME_QUESTION = `QUESTION`;
export const NARRATIVE_FRAME_QUOTED_SPEECH = `QUOTED_SPEECH`;
export const NARRATIVE_FRAME_ROLEPLAY = `ROLEPLAY`;
export const NARRATIVE_FRAME_STATEMENT = `STATEMENT`;
export const NARRATIVE_FRAME_STORY = `STORY`;

export const NARRATIVE_FRAMES = [
  NARRATIVE_FRAME_DIRECT_REQUEST,
  NARRATIVE_FRAME_EMPTY,
  NARRATIVE_FRAME_HYPOTHETICAL,
  NARRATIVE_FRAME_INSTRUCTIONAL,
  NARRATIVE_FRAME_QUESTION,
  NARRATIVE_FRAME_QUOTED_SPEECH,
  NARRATIVE_FRAME_ROLEPLAY,
  NARRATIVE_FRAME_STATEMENT,
  NARRATIVE_FRAME_STORY,
] as const;

export const QUOTED_SPEECH_PATTERN = /"[^"]+"|'[^']+'/u;
export const ROLEPLAY_FRAME_PATTERN =
  /\b(?:act as|imagine you are|pretend (?:to be|you are)|role ?play|take the role of|you are now)\b/iu;
export const STORY_FRAME_PATTERN =
  /\b(?:chapter|character|narrative|once upon a time|scene|short story|story)\b/iu;
export const HYPOTHETICAL_FRAME_PATTERN =
  /\b(?:hypothetically|imagine|suppose|what if|if i were|if you were)\b/iu;
export const DIRECT_REQUEST_PATTERN =
  /\b(?:can you|could you|please|help me|i need|we need)\b/iu;
export const INSTRUCTIONAL_FRAME_PATTERN =
  /^(?:build|create|draft|explain|generate|list|show|tell|write)\b/iu;
