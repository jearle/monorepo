import { HUGGING_FACE_EMBEDDING_MODELS } from './constants';

const NOMIC_EMBEDDING_MODEL_BASENAME = `nomic-embed-text-v1.5` as const;

const getModelBasename = (model: string) => {
  const modelWithoutRevision = model.split(`@`)[0] ?? model;
  const pathSegments = modelWithoutRevision.split(/[\\/]/);
  const basename = pathSegments.at(-1) ?? modelWithoutRevision;
  const result = basename;

  return result;
};

export const checkUsesNomicBehavior = (model: string) => {
  const modelBasename = getModelBasename(model);
  const result =
    model === HUGGING_FACE_EMBEDDING_MODELS.nomicEmbedTextV15 ||
    modelBasename === NOMIC_EMBEDDING_MODEL_BASENAME;

  return result;
};
