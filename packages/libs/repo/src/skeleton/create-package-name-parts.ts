import {
  SKELETON_RESULT_STATUS_ERROR,
  SKELETON_RESULT_STATUS_SUCCESS,
} from './constants';
import { createInvalidPackageNameError } from './errors';
import {
  type CreatePackageNamePartsResult,
  type PackageNameParts,
} from './types';

type CapitalizeWordProps = {
  readonly word: string;
};

const capitalizeWord = (props: CapitalizeWordProps) => {
  const { word } = props;
  const firstCharacter = word.charAt(0);
  const remainingCharacters = word.slice(1);
  const capitalizedFirstCharacter = firstCharacter.toUpperCase();
  const result = `${capitalizedFirstCharacter}${remainingCharacters}`;

  return result;
};

export type CreatePackageNamePartsProps = {
  readonly name: string;
};

export const createPackageNameParts = (
  props: CreatePackageNamePartsProps,
): CreatePackageNamePartsResult => {
  const { name } = props;
  const isValidName = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name);

  if (isValidName === false) {
    const error = createInvalidPackageNameError({ name });
    const result: CreatePackageNamePartsResult = {
      status: SKELETON_RESULT_STATUS_ERROR,
      error,
    };
    return result;
  }

  const words = name.split(`-`);
  const [firstWord] = words;

  if (firstWord === undefined) {
    const error = createInvalidPackageNameError({ name });
    const result: CreatePackageNamePartsResult = {
      status: SKELETON_RESULT_STATUS_ERROR,
      error,
    };
    return result;
  }

  const remainingWords = words.slice(1);
  const capitalizedRemainingWords = remainingWords.map((word) => {
    const result = capitalizeWord({ word });

    return result;
  });
  const capitalizedWords = words.map((word) => {
    const result = capitalizeWord({ word });

    return result;
  });
  const camelParts = [firstWord, ...capitalizedRemainingWords] as const;
  const kebab = name;
  const camel = camelParts.join(``);
  const pascal = capitalizedWords.join(``);
  const constant = name.replaceAll(`-`, `_`).toUpperCase();
  const nameParts: PackageNameParts = {
    kebab,
    camel,
    pascal,
    constant,
  };

  const result: CreatePackageNamePartsResult = {
    status: SKELETON_RESULT_STATUS_SUCCESS,
    data: {
      nameParts,
    },
  };

  return result;
};
