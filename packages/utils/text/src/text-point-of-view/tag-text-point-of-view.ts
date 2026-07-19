import { tokenizeText } from '../text-metrics';
import {
  FIRST_PERSON_PRONOUNS,
  POINT_OF_VIEW_FIRST_PERSON,
  POINT_OF_VIEW_MIXED,
  POINT_OF_VIEW_SECOND_PERSON,
  POINT_OF_VIEW_THIRD_PERSON,
  POINT_OF_VIEW_UNKNOWN,
  SECOND_PERSON_PRONOUNS,
  THIRD_PERSON_PRONOUNS,
} from './constants';
import { type PointOfView, type PointOfViewTag } from './types';

const countMatchingTokens = (
  tokens: readonly string[],
  values: readonly string[],
) => {
  const matchingTokens = tokens.filter((token) => values.includes(token));
  const result = matchingTokens.length;

  return result;
};

type GetPointOfViewProps = {
  readonly firstPersonCount: number;
  readonly secondPersonCount: number;
  readonly thirdPersonCount: number;
};

const getPointOfView = (props: GetPointOfViewProps): PointOfView => {
  const { firstPersonCount, secondPersonCount, thirdPersonCount } = props;
  const presentPointOfViews = [
    firstPersonCount > 0,
    secondPersonCount > 0,
    thirdPersonCount > 0,
  ].filter(Boolean);
  const presentPointOfViewCount = presentPointOfViews.length;

  if (presentPointOfViewCount === 0) {
    return POINT_OF_VIEW_UNKNOWN;
  }

  if (presentPointOfViewCount > 1) {
    return POINT_OF_VIEW_MIXED;
  }

  if (firstPersonCount > 0) {
    return POINT_OF_VIEW_FIRST_PERSON;
  }

  if (secondPersonCount > 0) {
    return POINT_OF_VIEW_SECOND_PERSON;
  }

  return POINT_OF_VIEW_THIRD_PERSON;
};

export type TagTextPointOfViewProps = {
  readonly text: string;
};

export const tagTextPointOfView = (props: TagTextPointOfViewProps) => {
  const { text } = props;
  const tokens = tokenizeText({ text });
  const firstPersonCount = countMatchingTokens(tokens, FIRST_PERSON_PRONOUNS);
  const secondPersonCount = countMatchingTokens(tokens, SECOND_PERSON_PRONOUNS);
  const thirdPersonCount = countMatchingTokens(tokens, THIRD_PERSON_PRONOUNS);
  const pointOfView = getPointOfView({
    firstPersonCount,
    secondPersonCount,
    thirdPersonCount,
  });
  const tag: PointOfViewTag = {
    firstPersonCount,
    pointOfView,
    secondPersonCount,
    thirdPersonCount,
  };
  const result = tag;

  return result;
};
