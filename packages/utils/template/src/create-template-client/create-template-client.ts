import {
  type CreateTemplateClientProps,
  type CreatedTemplateClient,
  type TemplateClient,
  type TemplateRenderOptions,
} from '../types';
import { analyzeSourceTemplateDependencies } from './analyze-source-template-dependencies';
import { analyzeTemplate } from './analyze-template';
import { createTemplateClientContext } from './create-template-client-context';
import { parseTemplate } from './parse-template';
import { renderTemplate } from './render-template';
import { renderTemplateFile } from './render-template-file';
import { renderSourceTemplate } from './render-source-template';
import { parseSourceTemplate } from './parse-source-template';

/**
 * Creates a reusable Liquid-backed template client with Monorepo Result returns.
 */
export const createTemplateClient = (
  props: CreateTemplateClientProps = {},
): CreatedTemplateClient => {
  const ctx = createTemplateClientContext(props);
  const templateClient: TemplateClient = {
    analyze: (template) => analyzeTemplate(ctx, { template }),
    analyzeSourceDependencies: (source) =>
      analyzeSourceTemplateDependencies(ctx, { source }),
    parse: (template, parseOptions) =>
      parseTemplate(ctx, { options: parseOptions, template }),
    parseSource: (source) => parseSourceTemplate(ctx, { source }),
    render: (template, data, options?: TemplateRenderOptions) =>
      renderTemplate(ctx, { data, options, template }),
    renderFile: (filePath, data, options?: TemplateRenderOptions) =>
      renderTemplateFile(ctx, { data, filePath, options }),
    renderSource: (source, data, options?: TemplateRenderOptions) =>
      renderSourceTemplate(ctx, { data, options, source }),
  };
  const createdTemplateClient = {
    templateClient,
  };

  return createdTemplateClient;
};
