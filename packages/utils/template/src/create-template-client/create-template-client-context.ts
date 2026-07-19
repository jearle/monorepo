import { Liquid } from 'liquidjs';
import { RESULT_STATUS_ERROR } from '@jearle/util-result';

import { type CreateTemplateClientProps } from '../types';
import { createLiquidOptions } from './create-liquid-options';
import { createTemplateClientContextError } from './errors';
import { normalizeTemplateClientOptions } from './normalize-template-client-options';
import { registerTemplateFilters } from './register-template-filters';
import { type TemplateClientContext } from './types';

export const createTemplateClientContext = (
  props: CreateTemplateClientProps,
): TemplateClientContext => {
  try {
    const optionsResult = normalizeTemplateClientOptions(props);

    if (optionsResult.status === RESULT_STATUS_ERROR) {
      const ctx: TemplateClientContext = {
        liquid: null,
        optionsResult,
      };

      return ctx;
    }

    const liquidOptions = createLiquidOptions({
      options: optionsResult.data,
    });
    const liquid = new Liquid(liquidOptions);

    registerTemplateFilters({
      filters: optionsResult.data.filters,
      liquid,
    });

    const ctx: TemplateClientContext = {
      liquid,
      optionsResult,
    };

    return ctx;
  } catch {
    const errorResult = createTemplateClientContextError();
    const ctx: TemplateClientContext = {
      liquid: null,
      optionsResult: errorResult,
    };

    return ctx;
  }
};
