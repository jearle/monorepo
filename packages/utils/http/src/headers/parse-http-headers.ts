import {
  RESULT_STATUS_ERROR,
  createResultError,
  createResultSuccess,
} from '@jearle/util-result';

import { HTTP_INVALID_HEADER_ERROR_CODE } from './constants';
import { type ParseHTTPHeadersResult } from './types';

const parseHeader = (header: string) => {
  const colonIndex = header.indexOf(`:`);
  const separatorIndex = colonIndex >= 0 ? colonIndex : header.indexOf(`=`);

  if (separatorIndex < 0) {
    return null;
  }

  const name = header.slice(0, separatorIndex).trim();
  const value = header.slice(separatorIndex + 1).trim();

  if (name.length === 0) {
    return null;
  }

  const parsedHeader = [name, value] as const;

  return parsedHeader;
};

export type ParseHTTPHeadersProps = {
  readonly headers: readonly string[];
};

export const parseHTTPHeaders = (
  props: ParseHTTPHeadersProps,
): ParseHTTPHeadersResult => {
  const { headers } = props;
  const parsedHeadersResult = headers.reduce<ParseHTTPHeadersResult>(
    (currentResult, header) => {
      if (currentResult.status === RESULT_STATUS_ERROR) {
        return currentResult;
      }

      const parsedHeaders = currentResult.data;
      const parsedHeader = parseHeader(header);

      if (parsedHeader === null) {
        const result = createResultError({
          code: HTTP_INVALID_HEADER_ERROR_CODE,
          message: `Invalid HTTP header: ${header}`,
        });

        return result;
      }

      const [name, value] = parsedHeader;
      const nextParsedHeaders = {
        ...parsedHeaders,
        [name]: value,
      };
      const result = createResultSuccess({
        data: nextParsedHeaders,
      });

      return result;
    },
    createResultSuccess({
      data: {},
    }),
  );
  const result = parsedHeadersResult;

  return result;
};
