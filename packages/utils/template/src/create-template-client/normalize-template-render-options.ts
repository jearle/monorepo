import {
  type Result,
  createResultSuccess,
  wrapResultError,
} from '@jearle/util-result';

import {
  TEMPLATE_INVALID_MEMORY_LIMIT_ERROR,
  TEMPLATE_INVALID_RENDER_LIMIT_ERROR,
  TEMPLATE_INVALID_TEMPLATE_LIMIT_ERROR,
  createTemplateInvalidOptionsResultError,
} from '../errors';
import { type TemplateRenderOptions } from '../types';
import {
  type NormalizedTemplateClientOptions,
  type NormalizedTemplateRenderOptions,
} from './types';

type CreateInvalidOptionsResultProps = {
  readonly message: string;
};

const createInvalidOptionsResult = (
  props: CreateInvalidOptionsResultProps,
): Result<NormalizedTemplateRenderOptions> => {
  const { message } = props;
  const error = createTemplateInvalidOptionsResultError({ message });
  const result = wrapResultError({ error });

  return result;
};

const checkIsValidLimit = (value: number) => {
  const result = Number.isInteger(value) && value >= 1;

  return result;
};
export type NormalizeTemplateRenderOptionsProps = {
  readonly clientOptions: NormalizedTemplateClientOptions;
  readonly renderOptions: TemplateRenderOptions | undefined;
};

export const normalizeTemplateRenderOptions = (
  props: NormalizeTemplateRenderOptionsProps,
) => {
  const { clientOptions, renderOptions } = props;
  const memoryLimit = renderOptions?.memoryLimit ?? clientOptions.memoryLimit;
  const renderLimit = renderOptions?.renderLimit ?? clientOptions.renderLimit;
  const templateLimit =
    renderOptions?.templateLimit ?? clientOptions.templateLimit;

  if (!checkIsValidLimit(memoryLimit)) {
    const result = createInvalidOptionsResult({
      message: TEMPLATE_INVALID_MEMORY_LIMIT_ERROR,
    });

    return result;
  }

  if (!checkIsValidLimit(renderLimit)) {
    const result = createInvalidOptionsResult({
      message: TEMPLATE_INVALID_RENDER_LIMIT_ERROR,
    });

    return result;
  }

  if (!checkIsValidLimit(templateLimit)) {
    const result = createInvalidOptionsResult({
      message: TEMPLATE_INVALID_TEMPLATE_LIMIT_ERROR,
    });

    return result;
  }

  const normalizedOptions: NormalizedTemplateRenderOptions = {
    globals: renderOptions?.globals ?? clientOptions.globals,
    memoryLimit,
    ownPropertyOnly:
      renderOptions?.ownPropertyOnly ?? clientOptions.ownPropertyOnly,
    renderLimit,
    strictVariables:
      renderOptions?.strictVariables ?? clientOptions.strictVariables,
    templateLimit,
  };
  const result = createResultSuccess({ data: normalizedOptions });

  return result;
};
