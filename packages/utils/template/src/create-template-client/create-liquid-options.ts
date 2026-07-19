import { type LiquidOptions } from 'liquidjs';

import { type NormalizedTemplateClientOptions } from './types';

export type CreateLiquidOptionsProps = {
  readonly options: NormalizedTemplateClientOptions;
};

export const createLiquidOptions = (props: CreateLiquidOptionsProps) => {
  const { options } = props;
  const liquidOptions: LiquidOptions = {
    cache: options.cache,
    extname: options.extname,
    globals: options.globals,
    layouts: options.layouts === undefined ? undefined : [...options.layouts],
    memoryLimit: options.memoryLimit,
    ownPropertyOnly: options.ownPropertyOnly,
    parseLimit: options.parseLimit,
    partials:
      options.partials === undefined ? undefined : [...options.partials],
    renderLimit: options.renderLimit,
    root: options.root === undefined ? undefined : [...options.root],
    strictFilters: options.strictFilters,
    strictVariables: options.strictVariables,
  };

  return liquidOptions;
};
