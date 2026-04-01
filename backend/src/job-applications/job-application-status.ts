export const JOB_APPLICATION_STATUSES = [
  'draft',
  'applied',
  'screening',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
] as const;

export type JobApplicationStatus = (typeof JOB_APPLICATION_STATUSES)[number];
