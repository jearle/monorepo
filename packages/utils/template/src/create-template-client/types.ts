import { type Liquid } from 'liquidjs';
import {
  type Result,
  type ResultFailure,
  type ResultSuccess,
} from '@jearle/util-result';

import { type TemplateData, type TemplateFilters } from '../types';

export type NormalizedTemplateClientOptions = {
  readonly cache: boolean | number;
  readonly extname: string | undefined;
  readonly filters: TemplateFilters | undefined;
  readonly globals: TemplateData | undefined;
  readonly layouts: readonly string[] | undefined;
  readonly memoryLimit: number;
  readonly ownPropertyOnly: boolean;
  readonly parseLimit: number;
  readonly partials: readonly string[] | undefined;
  readonly renderLimit: number;
  readonly root: readonly string[] | undefined;
  readonly strictFilters: boolean;
  readonly strictVariables: boolean;
  readonly templateLimit: number;
};

export type NormalizedTemplateRenderOptions = {
  readonly globals: TemplateData | undefined;
  readonly memoryLimit: number;
  readonly ownPropertyOnly: boolean;
  readonly renderLimit: number;
  readonly strictVariables: boolean;
  readonly templateLimit: number;
};

export type ReadyTemplateClientContext = {
  readonly liquid: Liquid;
  readonly optionsResult: ResultSuccess<NormalizedTemplateClientOptions>;
};

export type FailedTemplateClientContext = {
  readonly liquid: null;
  readonly optionsResult: ResultFailure;
};

export type TemplateClientContext =
  | FailedTemplateClientContext
  | ReadyTemplateClientContext;

export type NormalizeTemplateRenderOptionsResult =
  Result<NormalizedTemplateRenderOptions>;

export type NormalizeTemplateClientOptionsResult =
  Result<NormalizedTemplateClientOptions>;
