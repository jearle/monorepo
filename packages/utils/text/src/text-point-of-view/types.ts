import { type POINTS_OF_VIEW } from './constants';

export type PointOfView = (typeof POINTS_OF_VIEW)[number];

export type PointOfViewTag = {
  readonly firstPersonCount: number;
  readonly pointOfView: PointOfView;
  readonly secondPersonCount: number;
  readonly thirdPersonCount: number;
};
