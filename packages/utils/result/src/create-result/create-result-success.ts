import { RESULT_STATUS_SUCCESS } from '../constants';
import { type ResultSuccess } from '../types';

export type CreateResultSuccessProps<TData> = {
  readonly data: TData;
};

export const createResultSuccess = <TData>(
  props: CreateResultSuccessProps<TData>,
) => {
  const { data } = props;
  const result: ResultSuccess<TData> = {
    status: RESULT_STATUS_SUCCESS,
    data,
  };

  return result;
};
