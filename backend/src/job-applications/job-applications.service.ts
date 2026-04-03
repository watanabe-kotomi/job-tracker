import { Injectable } from '@nestjs/common';
import { ListJobApplicationsQueryDto } from './dto/list-job-applications-query.dto';
import {
  JobApplicationListItem,
  PaginatedResponse,
} from './job-application.types';

@Injectable()
export class JobApplicationsService {
  async findAll(
    query: ListJobApplicationsQueryDto,
  ): Promise<PaginatedResponse<JobApplicationListItem>> {
    const items: JobApplicationListItem[] = [
      {
        id: 'sample-application-id',
        company: {
          id: 'sample-company-id',
          name: 'A株式会社',
        },
        positionTitle: 'Backend Engineer',
        status: 'interview',
        appliedAt: '2026-03-20',
        source: 'LinkedIn',
        location: 'Tokyo',
        updatedAt: new Date().toISOString(),
      },
    ];

    return {
      items,
      page: query.page,
      limit: query.limit,
      total: items.length,
    };
  }
}
