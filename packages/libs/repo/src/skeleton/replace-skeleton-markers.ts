import {
  SKELETON_MARKER_COMMAND_CONSTANT,
  SKELETON_MARKER_COMMAND_CONTEXT,
  SKELETON_MARKER_COMMAND_VALUE,
  SKELETON_MARKER_CONSTANT,
  SKELETON_MARKER_CREATE_FUNCTION,
  SKELETON_MARKER_HEALTH_COMMAND_VALUE,
  SKELETON_MARKER_KEBAB,
  SKELETON_MARKER_PASCAL,
  SKELETON_MARKER_PROPS_CREATE,
  SKELETON_MARKER_RESULT_CREATE,
  SKELETON_MARKER_RESULT_VALUE,
} from './constants';
import { type PackageNameParts } from './types';

type CreateSkeletonMarkerReplacementsProps = {
  readonly nameParts: PackageNameParts;
};

const createSkeletonMarkerReplacements = (
  props: CreateSkeletonMarkerReplacementsProps,
) => {
  const { nameParts } = props;
  const { camel, constant, kebab, pascal } = nameParts;
  const replacements = [
    {
      marker: SKELETON_MARKER_COMMAND_CONSTANT,
      replacement: `COMMAND_${constant}`,
    },
    {
      marker: SKELETON_MARKER_PROPS_CREATE,
      replacement: `Create${pascal}Props`,
    },
    {
      marker: SKELETON_MARKER_RESULT_CREATE,
      replacement: `Create${pascal}Result`,
    },
    {
      marker: SKELETON_MARKER_CREATE_FUNCTION,
      replacement: `create${pascal}`,
    },
    {
      marker: SKELETON_MARKER_COMMAND_CONTEXT,
      replacement: `${pascal}CommandContext`,
    },
    {
      marker: SKELETON_MARKER_HEALTH_COMMAND_VALUE,
      replacement: `${camel}HealthCommand`,
    },
    {
      marker: SKELETON_MARKER_COMMAND_VALUE,
      replacement: `${camel}Command`,
    },
    {
      marker: SKELETON_MARKER_RESULT_VALUE,
      replacement: `${camel}Result`,
    },
    {
      marker: SKELETON_MARKER_PASCAL,
      replacement: pascal,
    },
    {
      marker: SKELETON_MARKER_CONSTANT,
      replacement: constant,
    },
    {
      marker: SKELETON_MARKER_KEBAB,
      replacement: kebab,
    },
  ] as const;

  const result = { replacements };

  return result;
};
export type ReplaceSkeletonMarkersProps = {
  readonly value: string;
  readonly nameParts: PackageNameParts;
};

export const replaceSkeletonMarkers = (props: ReplaceSkeletonMarkersProps) => {
  const { value, nameParts } = props;
  const { replacements } = createSkeletonMarkerReplacements({ nameParts });
  const result = replacements.reduce((currentValue, replacementEntry) => {
    const { marker, replacement } = replacementEntry;
    const replacedValue = currentValue.split(marker).join(replacement);

    return replacedValue;
  }, value);

  return result;
};
