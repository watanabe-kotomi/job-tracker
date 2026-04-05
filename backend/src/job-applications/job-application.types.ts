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

export type JobApplicationDetail = {
  id: string;
  company: {
    id: string;
    name: string;
    websiteUrl: string | null;
    country: string | null;
    notes: string | null;
  };
  positionTitle: string;
  status: string;
  appliedAt: string | null;
  source: string | null;
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  jobPostUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};
