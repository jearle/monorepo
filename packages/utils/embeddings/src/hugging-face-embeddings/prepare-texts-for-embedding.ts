import { checkUsesNomicBehavior } from './check-uses-nomic-behavior';

const NOMIC_TASK_PREFIXES = [
  `search_document`,
  `search_query`,
  `clustering`,
  `classification`,
] as const;
const DEFAULT_NOMIC_TASK_PREFIX = `clustering` as const;

const getHasNomicTaskPrefix = (text: string) => {
  const result = NOMIC_TASK_PREFIXES.some((taskPrefix) => {
    const prefixedText = `${taskPrefix}:`;
    const hasPrefix = text.startsWith(prefixedText);

    return hasPrefix;
  });

  return result;
};

const prepareNomicText = (text: string) => {
  const hasTaskPrefix = getHasNomicTaskPrefix(text);

  if (hasTaskPrefix) {
    const result = text;

    return result;
  }

  const preparedText = `${DEFAULT_NOMIC_TASK_PREFIX}: ${text}`;
  const result = preparedText;

  return result;
};
export type PrepareTextsForEmbeddingProps = {
  readonly model: string;
  readonly texts: readonly string[];
};

export const prepareTextsForEmbedding = (
  props: PrepareTextsForEmbeddingProps,
) => {
  const { model, texts } = props;
  const usesNomicBehavior = checkUsesNomicBehavior(model);

  if (usesNomicBehavior === false) {
    const result = texts;

    return result;
  }

  const preparedTexts = texts.map((text) => {
    const preparedText = prepareNomicText(text);
    const result = preparedText;

    return result;
  });
  const result = preparedTexts;

  return result;
};
