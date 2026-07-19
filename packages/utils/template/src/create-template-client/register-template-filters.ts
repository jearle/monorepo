import { type Liquid } from 'liquidjs';

import { type TemplateFilters } from '../types';

export type RegisterTemplateFiltersProps = {
  readonly filters: TemplateFilters | undefined;
  readonly liquid: Liquid;
};

export const registerTemplateFilters = (
  props: RegisterTemplateFiltersProps,
) => {
  const { filters, liquid } = props;

  if (filters === undefined) {
    return;
  }

  for (const [filterName, filter] of Object.entries(filters)) {
    liquid.registerFilter(
      filterName,
      function (this: unknown, value: unknown, ...args: unknown[]) {
        const result = filter.call(this, value, ...args);

        return result;
      },
    );
  }
};
