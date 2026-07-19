import { expect, test } from 'bun:test';

import {
  NARRATIVE_FRAME_HYPOTHETICAL,
  NARRATIVE_FRAME_QUESTION,
  NARRATIVE_FRAME_QUOTED_SPEECH,
  NARRATIVE_FRAME_ROLEPLAY,
  NARRATIVE_FRAME_STORY,
  tagTextNarrativeFrame,
} from '.';

test(`tags narrative frames for hypotheticals and quoted speech`, () => {
  expect(
    tagTextNarrativeFrame({ text: `What if I forgot my token?` }).frame,
  ).toBe(NARRATIVE_FRAME_HYPOTHETICAL);
  expect(
    tagTextNarrativeFrame({ text: `"Reset it now," the user wrote.` }).frame,
  ).toBe(NARRATIVE_FRAME_QUOTED_SPEECH);
});

test(`tags plain questions when no stronger frame is present`, () => {
  const result = tagTextNarrativeFrame({
    text: `Where is the export?`,
  });

  expect(result.frame).toBe(NARRATIVE_FRAME_QUESTION);
  expect(result.hasQuestion).toBe(true);
});

test(`tags roleplay and story frames before weaker request cues`, () => {
  const roleplayResult = tagTextNarrativeFrame({
    text: `Act as a support coach and ask one careful question.`,
  });
  const storyResult = tagTextNarrativeFrame({
    text: `Write a short story about a character asking for help.`,
  });

  expect(roleplayResult.frame).toBe(NARRATIVE_FRAME_ROLEPLAY);
  expect(roleplayResult.hasRoleplayFrame).toBe(true);
  expect(storyResult.frame).toBe(NARRATIVE_FRAME_STORY);
  expect(storyResult.hasStoryFrame).toBe(true);
});
