import { type Emitter, type Template, Liquid, Parser } from 'liquidjs';

import {
  TEMPLATE_SOURCE_LIMIT_ERROR_CODE,
  TEMPLATE_SOURCE_RENDER_LIMIT_ERROR,
} from '../errors';
import { createSourceTemplateFailure } from './errors';

export type CreateTemplateLimitedLiquidProps = {
  readonly initialTemplateLimit: number;
  readonly liquidOptions: ConstructorParameters<typeof Liquid>[0];
};

export const createTemplateLimitedLiquid = (
  props: CreateTemplateLimitedLiquidProps,
) => {
  const baseLiquid = new Liquid(props.liquidOptions);
  let renderedTemplateCount = 0;
  let templateLimit = props.initialTemplateLimit;
  const renderer = new Proxy(baseLiquid.renderer, {
    get: (target, property, receiver) => {
      if (property !== `renderTemplates`) {
        const value: unknown = Reflect.get(target, property, receiver);

        return value;
      }

      const result = function* renderTemplates(
        templates: Template[],
        context: Parameters<typeof target.renderTemplates>[1],
        emitter?: Emitter,
      ) {
        renderedTemplateCount += templates.length;

        if (renderedTemplateCount > templateLimit) {
          throw createSourceTemplateFailure(
            TEMPLATE_SOURCE_RENDER_LIMIT_ERROR,
            TEMPLATE_SOURCE_LIMIT_ERROR_CODE,
          );
        }

        const result: unknown = yield* target.renderTemplates(
          templates,
          context,
          emitter,
        );

        return result;
      };

      return result;
    },
  });
  let parser = baseLiquid.parser;
  const liquid = new Proxy(baseLiquid, {
    get: (target, property, receiver) => {
      if (property === `renderer`) {
        return renderer;
      }

      if (property === `parser` && parser !== undefined) {
        return parser;
      }

      const value: unknown = Reflect.get(target, property, receiver);

      return value;
    },
  });

  parser = new Parser(liquid);

  const result = {
    liquid,
    resetTemplateLimit: (limit: number) => {
      renderedTemplateCount = 0;
      templateLimit = limit;
    },
  };

  return result;
};
