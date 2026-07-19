import { type z } from 'zod';

import { OpenAIEmbeddingsResponseSchema } from './open-ai-embeddings-response-schema';
import {
  createInvalidResponseErrorMessage,
  createRequestErrorMessage,
} from './errors';
import { fetchOpenrouterEmbeddings } from './fetch-openrouter-embeddings';
import {
  type EmbeddingVector,
  type OpenrouterEmbeddingsResult,
  OPENROUTER_EMBEDDINGS_RESULT_STATUS_ERROR,
  OPENROUTER_EMBEDDINGS_RESULT_STATUS_SUCCESS,
} from './types';

const BATCH_SIZE = 512;
const NO_TEXTS_PROVIDED_ERROR = `no texts provided`;

type EmbedProps = {
  readonly texts: readonly string[];
};

type OpenAIEmbeddingsResponse = z.infer<typeof OpenAIEmbeddingsResponseSchema>;
type OpenAIEmbeddingResponseItem = OpenAIEmbeddingsResponse[`data`][number];

type IndexedVector = {
  readonly index: number;
  readonly vector: EmbeddingVector;
};

type ParseEmbeddingsResponseData = {
  readonly embeddingsResponse: OpenAIEmbeddingsResponse;
};

type IndexedVectorsStateData = {
  readonly indexedVectors: readonly IndexedVector[];
};

type CreateBatchesProps = {
  readonly texts: readonly string[];
};

type CreateBatchProps = {
  readonly batchIndex: number;
  readonly texts: readonly string[];
};

type ParseEmbeddingsResponseProps = {
  readonly json: unknown;
};
type ParseEmbeddingsResponseResultFailure = {
  readonly status: typeof OPENROUTER_EMBEDDINGS_RESULT_STATUS_ERROR;
  readonly error: string;
};

type ParseEmbeddingsResponseResultFailure2 = {
  readonly status: typeof OPENROUTER_EMBEDDINGS_RESULT_STATUS_SUCCESS;
  readonly data: ParseEmbeddingsResponseData;
};

type ParseEmbeddingsResponseResult =
  | ParseEmbeddingsResponseResultFailure
  | ParseEmbeddingsResponseResultFailure2;

type CreateIndexedVectorProps = {
  readonly globalOffset: number;
  readonly item: OpenAIEmbeddingResponseItem;
};

type CreateIndexedVectorsProps = {
  readonly batchIndex: number;
  readonly embeddingsResponse: OpenAIEmbeddingsResponse;
};

type FetchBatchIndexedVectorsProps = {
  readonly api: string;
  readonly apiKey: string;
  readonly model: string;
  readonly batch: readonly string[];
  readonly batchIndex: number;
};
type IndexedVectorsStateFailure = {
  readonly status: typeof OPENROUTER_EMBEDDINGS_RESULT_STATUS_ERROR;
  readonly error: string;
};

type IndexedVectorsStateFailure2 = {
  readonly status: typeof OPENROUTER_EMBEDDINGS_RESULT_STATUS_SUCCESS;
  readonly data: IndexedVectorsStateData;
};

type IndexedVectorsState =
  | IndexedVectorsStateFailure
  | IndexedVectorsStateFailure2;

type FetchAllIndexedVectorsProps = {
  readonly api: string;
  readonly apiKey: string;
  readonly model: string;
  readonly batches: readonly (readonly string[])[];
};

const compareIndexedVectors = (
  indexedVector1: IndexedVector,
  indexedVector2: IndexedVector,
) => {
  const { index: index1 } = indexedVector1;
  const { index: index2 } = indexedVector2;
  const result = index1 - index2;

  return result;
};

const getVector = (indexedVector: IndexedVector) => {
  const { vector } = indexedVector;
  const result = vector;

  return result;
};
type CheckIsIndexedVectorsErrorResultShape = {
  readonly status: typeof OPENROUTER_EMBEDDINGS_RESULT_STATUS_ERROR;
  readonly error: string;
};

const checkIsIndexedVectorsErrorResult = (
  indexedVectorsResult: IndexedVectorsState,
): indexedVectorsResult is CheckIsIndexedVectorsErrorResultShape => {
  const result =
    indexedVectorsResult.status === OPENROUTER_EMBEDDINGS_RESULT_STATUS_ERROR;

  return result;
};
type CheckIsIndexedVectorsSuccessResultShape = {
  readonly status: typeof OPENROUTER_EMBEDDINGS_RESULT_STATUS_SUCCESS;
  readonly data: IndexedVectorsStateData;
};

const checkIsIndexedVectorsSuccessResult = (
  indexedVectorsResult: IndexedVectorsState,
): indexedVectorsResult is CheckIsIndexedVectorsSuccessResultShape => {
  const result =
    indexedVectorsResult.status === OPENROUTER_EMBEDDINGS_RESULT_STATUS_SUCCESS;

  return result;
};
type GetIndexedVectorsIndexedVectorsResultShape = {
  readonly status: typeof OPENROUTER_EMBEDDINGS_RESULT_STATUS_SUCCESS;
  readonly data: IndexedVectorsStateData;
};

const getIndexedVectors = (
  indexedVectorsResult: GetIndexedVectorsIndexedVectorsResultShape,
) => {
  const { indexedVectors } = indexedVectorsResult.data;
  const result = indexedVectors;

  return result;
};

const mergeIndexedVectors = (
  indexedVectorsCollections: readonly (readonly IndexedVector[])[],
) => {
  const indexedVectors = indexedVectorsCollections.flat();
  const result = indexedVectors;

  return result;
};

const createBatch = (props: CreateBatchProps) => {
  const { batchIndex, texts } = props;
  const batchStart = batchIndex * BATCH_SIZE;
  const nextBatchIndex = batchIndex + 1;
  const batchEnd = nextBatchIndex * BATCH_SIZE;
  const batch = texts.slice(batchStart, batchEnd);
  const result = batch;

  return result;
};

const createBatches = (props: CreateBatchesProps) => {
  const { texts } = props;
  const textCount = texts.length;
  const batchCountRaw = textCount / BATCH_SIZE;
  const batchCount = Math.ceil(batchCountRaw);
  const batchCountProps = { length: batchCount };
  const batchIndexes = Array.from(batchCountProps);
  const batches = batchIndexes.map((_, batchIndex) => {
    const batch = createBatch({ batchIndex, texts });
    const result = batch;

    return result;
  });
  const result = batches;

  return result;
};

const parseEmbeddingsResponse = (props: ParseEmbeddingsResponseProps) => {
  const { json } = props;
  const parsedJSON = OpenAIEmbeddingsResponseSchema.safeParse(json);
  const { success } = parsedJSON;

  if (success === false) {
    const { error } = parsedJSON;
    const errorMessage = createInvalidResponseErrorMessage({ error, json });
    const result: ParseEmbeddingsResponseResult = {
      status: OPENROUTER_EMBEDDINGS_RESULT_STATUS_ERROR,
      error: errorMessage,
    };

    return result;
  }

  const { data: embeddingsResponse } = parsedJSON;
  const result: ParseEmbeddingsResponseResult = {
    status: OPENROUTER_EMBEDDINGS_RESULT_STATUS_SUCCESS,
    data: {
      embeddingsResponse,
    },
  };

  return result;
};

const createIndexedVector = (props: CreateIndexedVectorProps) => {
  const { globalOffset, item } = props;
  const { index: itemIndex, embedding } = item;
  const index = globalOffset + itemIndex;
  const vector = embedding;
  const indexedVector = { index, vector };
  const result = indexedVector;

  return result;
};

const createIndexedVectors = (props: CreateIndexedVectorsProps) => {
  const { batchIndex, embeddingsResponse } = props;
  const globalOffset = batchIndex * BATCH_SIZE;
  const { data } = embeddingsResponse;
  const indexedVectors = data.map((item) => {
    const indexedVector = createIndexedVector({ globalOffset, item });
    const result = indexedVector;

    return result;
  });
  const result = indexedVectors;

  return result;
};

const fetchBatchIndexedVectors = async (
  props: FetchBatchIndexedVectorsProps,
) => {
  const { api, apiKey, model, batch, batchIndex } = props;
  const { response } = await fetchOpenrouterEmbeddings({
    api,
    apiKey,
    model,
    texts: batch,
  });
  const responseStatus = response.status;
  const responseOK = response.ok;
  const json: unknown = await response.json();

  if (responseOK === false) {
    const errorMessage = createRequestErrorMessage({ responseStatus, json });
    const result: IndexedVectorsState = {
      status: OPENROUTER_EMBEDDINGS_RESULT_STATUS_ERROR,
      error: errorMessage,
    };

    return result;
  }

  const parsedResponse = parseEmbeddingsResponse({ json });

  if (parsedResponse.status === OPENROUTER_EMBEDDINGS_RESULT_STATUS_ERROR) {
    const result: IndexedVectorsState = {
      status: OPENROUTER_EMBEDDINGS_RESULT_STATUS_ERROR,
      error: parsedResponse.error,
    };

    return result;
  }

  const { embeddingsResponse } = parsedResponse.data;
  const indexedVectors = createIndexedVectors({
    batchIndex,
    embeddingsResponse,
  });
  const result: IndexedVectorsState = {
    status: OPENROUTER_EMBEDDINGS_RESULT_STATUS_SUCCESS,
    data: {
      indexedVectors,
    },
  };

  return result;
};

const fetchAllIndexedVectors = async (props: FetchAllIndexedVectorsProps) => {
  const { api, apiKey, model, batches } = props;
  const batchResultPromises = batches.map((batch, batchIndex) => {
    const batchResultPromise = fetchBatchIndexedVectors({
      api,
      apiKey,
      model,
      batch,
      batchIndex,
    });
    const result = batchResultPromise;

    return result;
  });
  const batchResults = await Promise.all(batchResultPromises);
  const errorResult = batchResults.find(checkIsIndexedVectorsErrorResult);

  if (errorResult !== undefined) {
    const { error } = errorResult;
    const result: IndexedVectorsState = {
      status: OPENROUTER_EMBEDDINGS_RESULT_STATUS_ERROR,
      error,
    };

    return result;
  }

  const successResults = batchResults.filter(
    checkIsIndexedVectorsSuccessResult,
  );
  const indexedVectorsCollections = successResults.map(getIndexedVectors);
  const indexedVectors = mergeIndexedVectors(indexedVectorsCollections);
  const result: IndexedVectorsState = {
    status: OPENROUTER_EMBEDDINGS_RESULT_STATUS_SUCCESS,
    data: {
      indexedVectors,
    },
  };

  return result;
};
export type CreateOpenrouterEmbeddingsProps = {
  readonly api: string;
  readonly apiKey: string;
  readonly model: string;
};

/**
 * Creates an OpenRouter embeddings adapter with a `texts -> vectors` contract.
 *
 * @param props - The OpenRouter embeddings configuration.
 * @returns An embeddings adapter with batched request handling.
 *
 * @example
 * const { embeddings } = createOpenrouterEmbeddings({
 *   api: `https://openrouter.ai/api/v1/chat/completions`,
 *   apiKey: `test-key`,
 *   model: `openai/text-embedding-3-small`,
 * });
 */
export const createOpenrouterEmbeddings = (
  props: CreateOpenrouterEmbeddingsProps,
) => {
  const { api, apiKey, model } = props;

  const embed = async (
    props: EmbedProps,
  ): Promise<OpenrouterEmbeddingsResult> => {
    const { texts } = props;
    const hasNoTexts = texts.length === 0;

    if (hasNoTexts) {
      const result: OpenrouterEmbeddingsResult = {
        status: OPENROUTER_EMBEDDINGS_RESULT_STATUS_ERROR,
        error: NO_TEXTS_PROVIDED_ERROR,
      };
      return result;
    }

    const batches = createBatches({ texts });
    const indexedVectorsResult = await fetchAllIndexedVectors({
      api,
      apiKey,
      model,
      batches,
    });

    if (
      indexedVectorsResult.status === OPENROUTER_EMBEDDINGS_RESULT_STATUS_ERROR
    ) {
      const result: OpenrouterEmbeddingsResult = {
        status: OPENROUTER_EMBEDDINGS_RESULT_STATUS_ERROR,
        error: indexedVectorsResult.error,
      };
      return result;
    }

    const { indexedVectors } = indexedVectorsResult.data;
    const sortedIndexedVectors = indexedVectors.toSorted(compareIndexedVectors);
    const vectors = sortedIndexedVectors.map(getVector);

    const result: OpenrouterEmbeddingsResult = {
      status: OPENROUTER_EMBEDDINGS_RESULT_STATUS_SUCCESS,
      data: {
        vectors,
      },
    };

    return result;
  };

  const embeddings = { embed };

  const result = { embeddings };

  return result;
};

export type OpenRouterEmbeddings = ReturnType<
  typeof createOpenrouterEmbeddings
>[`embeddings`];
