export type JobApplicationListItem = {
  id: string;
  company: {
    id: string;
    name: string;
  };
  positionTitle: string;
  status: string;
  appliedAt: string | null;
  source: string | null;
  location: string | null;
  updatedAt: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
};
