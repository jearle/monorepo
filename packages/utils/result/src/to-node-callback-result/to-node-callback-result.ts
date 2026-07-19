import { toAsyncResult } from '../to-async-result';
import { type Result } from '../types';

export type NodeCallback<TData> = (error: unknown, data: TData) => void;

export type NodeCallbackOperation<TArgs extends readonly unknown[], TData> = (
  ...args: [...TArgs, NodeCallback<TData>]
) => void;

export type ToNodeCallbackResultProps<
  TArgs extends readonly unknown[],
  TData,
> = {
  readonly operation: NodeCallbackOperation<TArgs, TData>;
  readonly args: TArgs;
};

/**
 * Runs an error-first callback operation and returns the same discriminated
 * result shape as promise-based operations.
 */
export const toNodeCallbackResult = async <
  TArgs extends readonly unknown[],
  TData,
>(
  props: ToNodeCallbackResultProps<TArgs, TData>,
): Promise<Result<TData>> => {
  const { operation, args } = props;
  const operationPromise = new Promise<TData>((resolve, reject) => {
    const callback: NodeCallback<TData> = (error, data) => {
      const hasError = error !== null && error !== undefined;

      if (hasError) {
        reject(error);
        return;
      }

      resolve(data);
    };

    operation(...args, callback);
  });
  const result = await toAsyncResult({
    operation: async () => operationPromise,
  });

  return result;
};
