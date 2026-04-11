import { Prisma } from '@prisma/client';
import { JobApplicationDetail } from './job-application.types';

type JobApplicationWithCompany = Prisma.JobApplicationGetPayload<{
  include: {
    company: true;
  };
}>;

export const toJobApplicationDetail = (
  application: JobApplicationWithCompany,
): JobApplicationDetail => {
  return {
    id: application.id,
    company: {
      id: application.company.id,
      name: application.company.name,
      websiteUrl: application.company.websiteUrl,
      country: application.company.country,
      notes: application.company.notes,
    },
    positionTitle: application.positionTitle,
    status: application.status,
    appliedAt: application.appliedAt
      ? application.appliedAt.toISOString().slice(0, 10)
      : null,
    source: application.source,
    location: application.location,
    salaryMin: application.salaryMin,
    salaryMax: application.salaryMax,
    jobPostUrl: application.jobPostUrl,
    notes: application.notes,
    createdAt: application.createdAt.toISOString(),
    updatedAt: application.updatedAt.toISOString(),
  };
};
