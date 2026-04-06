export type CompanyListItem = {
  id: string;
  name: string;
  websiteUrl: string | null;
  country: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
};
