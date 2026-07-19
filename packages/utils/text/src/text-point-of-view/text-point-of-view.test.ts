import { expect, test } from 'bun:test';

import {
  POINT_OF_VIEW_FIRST_PERSON,
  POINT_OF_VIEW_MIXED,
  POINT_OF_VIEW_SECOND_PERSON,
  POINT_OF_VIEW_THIRD_PERSON,
  tagTextPointOfView,
} from '.';

test(`tags point of view including quoted speech`, () => {
  expect(tagTextPointOfView({ text: `I need help with my account.` })).toEqual({
    firstPersonCount: 2,
    pointOfView: POINT_OF_VIEW_FIRST_PERSON,
    secondPersonCount: 0,
    thirdPersonCount: 0,
  });
  expect(tagTextPointOfView({ text: `Can you review your settings?` })).toEqual(
    {
      firstPersonCount: 0,
      pointOfView: POINT_OF_VIEW_SECOND_PERSON,
      secondPersonCount: 2,
      thirdPersonCount: 0,
    },
  );
  expect(tagTextPointOfView({ text: `They changed their password.` })).toEqual({
    firstPersonCount: 0,
    pointOfView: POINT_OF_VIEW_THIRD_PERSON,
    secondPersonCount: 0,
    thirdPersonCount: 2,
  });
  expect(
    tagTextPointOfView({ text: `"I need help," she said to you.` }),
  ).toEqual({
    firstPersonCount: 1,
    pointOfView: POINT_OF_VIEW_MIXED,
    secondPersonCount: 1,
    thirdPersonCount: 1,
  });
});

test(`counts informal second-person pronouns`, () => {
  const result = tagTextPointOfView({
    text: `y'all should check ur settings`,
  });

  expect(result.pointOfView).toBe(POINT_OF_VIEW_SECOND_PERSON);
  expect(result.secondPersonCount).toBe(2);
});

test(`counts expanded first, second, and third-person pronouns`, () => {
  const result = tagTextPointOfView({
    text: `let's ask youse if xe helped themself`,
  });

  expect(result.pointOfView).toBe(POINT_OF_VIEW_MIXED);
  expect(result.firstPersonCount).toBe(1);
  expect(result.secondPersonCount).toBe(1);
  expect(result.thirdPersonCount).toBe(2);
});
