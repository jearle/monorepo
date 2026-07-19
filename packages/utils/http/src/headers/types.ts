import { type Result } from '@jearle/util-result';
export type HTTPHeaders = Record<string, string>;

export type ParseHTTPHeadersResult = Result<HTTPHeaders>;
