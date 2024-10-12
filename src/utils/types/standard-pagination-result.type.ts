export type StandardPaginationResultType<T> = Readonly<{
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}>;
