import { HTTP_CONTENT_TYPE_JSON, HTTP_HEADER_CONTENT_TYPE } from '../constants';
import { type HTTPHeaders } from './types';

export type CreateHTTPJSONHeadersProps = {
  readonly headers: HTTPHeaders;
};

export const createHTTPJSONHeaders = (props: CreateHTTPJSONHeadersProps) => {
  const { headers } = props;
  const requestHeaders = new Headers(headers);

  if (requestHeaders.has(HTTP_HEADER_CONTENT_TYPE)) {
    return headers;
  }

  const result = {
    ...headers,
    [HTTP_HEADER_CONTENT_TYPE]: HTTP_CONTENT_TYPE_JSON,
  };

  return result;
};
