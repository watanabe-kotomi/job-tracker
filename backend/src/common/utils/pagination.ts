export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginationResult = {
  page: number;
  limit: number;
  skip: number;
};

export const getPagination = ({
  page,
  limit,
}: PaginationParams): PaginationResult => {
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 ? limit : 20;

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
};
