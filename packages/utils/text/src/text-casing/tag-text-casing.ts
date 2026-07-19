import {
  CAMEL_CASE_PATTERN,
  CONSTANT_CASE_PATTERN,
  KEBAB_CASE_PATTERN,
  PASCAL_CASE_PATTERN,
  SNAKE_CASE_PATTERN,
  TEXT_CASING_STYLE_CAMEL_CASE,
  TEXT_CASING_STYLE_CONSTANT_CASE,
  TEXT_CASING_STYLE_EMPTY,
  TEXT_CASING_STYLE_KEBAB_CASE,
  TEXT_CASING_STYLE_LOWERCASE,
  TEXT_CASING_STYLE_MIXED_CASE,
  TEXT_CASING_STYLE_PASCAL_CASE,
  TEXT_CASING_STYLE_SENTENCE_CASE,
  TEXT_CASING_STYLE_SNAKE_CASE,
  TEXT_CASING_STYLE_TITLE_CASE,
  TEXT_CASING_STYLE_UPPERCASE,
  TEXT_WORD_PATTERN,
} from './constants';
import { type TextCasingStyle, type TextCasingTag } from './types';

const getWords = (text: string) => {
  const result = text.match(TEXT_WORD_PATTERN) ?? [];

  return result;
};

const checkIsLowercase = (value: string) => {
  const result = value === value.toLocaleLowerCase(`en-US`);

  return result;
};

const checkIsUppercase = (value: string) => {
  const result = value === value.toLocaleUpperCase(`en-US`);

  return result;
};

const checkIsTitleCaseWord = (word: string) => {
  const [firstCharacter = ``, ...remainingCharacters] = Array.from(word);
  const remainingText = remainingCharacters.join(``);
  const hasUppercaseFirstCharacter = checkIsUppercase(firstCharacter);
  const hasLowercaseRemainder = checkIsLowercase(remainingText);
  const result = hasUppercaseFirstCharacter && hasLowercaseRemainder;

  return result;
};

const getIdentifierCasingStyle = (text: string): TextCasingStyle | null => {
  if (CONSTANT_CASE_PATTERN.test(text)) {
    return TEXT_CASING_STYLE_CONSTANT_CASE;
  }

  if (KEBAB_CASE_PATTERN.test(text)) {
    return TEXT_CASING_STYLE_KEBAB_CASE;
  }

  if (SNAKE_CASE_PATTERN.test(text)) {
    return TEXT_CASING_STYLE_SNAKE_CASE;
  }

  if (CAMEL_CASE_PATTERN.test(text)) {
    return TEXT_CASING_STYLE_CAMEL_CASE;
  }

  if (PASCAL_CASE_PATTERN.test(text)) {
    return TEXT_CASING_STYLE_PASCAL_CASE;
  }

  return null;
};

const getTextCasingStyle = (text: string): TextCasingStyle => {
  const identifierStyle = getIdentifierCasingStyle(text);

  if (identifierStyle !== null) {
    return identifierStyle;
  }

  const words = getWords(text);
  const hasNoWords = words.length === 0;

  if (hasNoWords) {
    return TEXT_CASING_STYLE_EMPTY;
  }

  const letterText = words.join(``);
  const isUppercase = checkIsUppercase(letterText);
  const isLowercase = checkIsLowercase(letterText);

  if (isUppercase) {
    return TEXT_CASING_STYLE_UPPERCASE;
  }

  if (isLowercase) {
    return TEXT_CASING_STYLE_LOWERCASE;
  }

  const isTitleCase = words.every(checkIsTitleCaseWord);

  if (isTitleCase) {
    return TEXT_CASING_STYLE_TITLE_CASE;
  }

  const [firstWord = ``] = words;
  const remainingWords = words.slice(1);
  const isSentenceCase =
    checkIsTitleCaseWord(firstWord) && remainingWords.every(checkIsLowercase);

  if (isSentenceCase) {
    return TEXT_CASING_STYLE_SENTENCE_CASE;
  }

  return TEXT_CASING_STYLE_MIXED_CASE;
};

export type TagTextCasingProps = {
  readonly text: string;
};

export const tagTextCasing = (props: TagTextCasingProps) => {
  const { text } = props;
  const style = getTextCasingStyle(text);
  const tag: TextCasingTag = {
    style,
  };
  const result = tag;

  return result;
};
