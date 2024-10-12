import { StandardPaginationResultType } from './types/standard-pagination-result.type';

export const standardPagination = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): StandardPaginationResultType<T> => {
  const lastPage = Math.ceil(total / limit);
  const meta = {
    current_page: page,
    last_page: lastPage,
    per_page: limit,
    total: total,
  };

  return {
    data,
    meta,
  };
};
