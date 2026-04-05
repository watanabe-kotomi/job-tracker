import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ListJobApplicationsQueryDto } from './dto/list-job-applications-query.dto';
import {
  JobApplicationDetail,
  JobApplicationListItem,
  PaginatedResponse,
} from './job-application.types';
import { JOB_APPLICATION_NOT_FOUND_MESSAGE } from './job-applications.constants';

@Injectable()
export class JobApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: ListJobApplicationsQueryDto,
  ): Promise<PaginatedResponse<JobApplicationListItem>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const user = await this.prisma.user.findUnique({
      where: { email: 'demo@example.com' },
    });

    if (!user) {
      return {
        items: [],
        page,
        limit,
        total: 0,
      };
    }

    const where = {
      userId: user.id,
      ...(query.status ? { status: query.status } : {}),
      ...(query.companyId ? { companyId: query.companyId } : {}),
      ...(query.keyword
        ? {
            OR: [
              {
                positionTitle: {
                  contains: query.keyword,
                  mode: 'insensitive' as const,
                },
              },
              {
                company: {
                  name: {
                    contains: query.keyword,
                    mode: 'insensitive' as const,
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [applications, total] = await this.prisma.$transaction([
      this.prisma.jobApplication.findMany({
        where,
        include: {
          company: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.jobApplication.count({
        where,
      }),
    ]);

    const items: JobApplicationListItem[] = applications.map((application) => ({
      id: application.id,
      company: {
        id: application.company.id,
        name: application.company.name,
      },
      positionTitle: application.positionTitle,
      status: application.status,
      appliedAt: application.appliedAt
        ? application.appliedAt.toISOString().slice(0, 10)
        : null,
      source: application.source,
      location: application.location,
      updatedAt: application.updatedAt.toISOString(),
    }));

    return {
      items,
      page: query.page,
      limit: query.limit,
      total: items.length,
    };
  }

  async findOne(id: string): Promise<JobApplicationDetail> {
    const user = await this.prisma.user.findUnique({
      where: { email: 'demo@example.com' },
    });

    if (!user) {
      throw new NotFoundException(JOB_APPLICATION_NOT_FOUND_MESSAGE);
    }

    const application = await this.prisma.jobApplication.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        company: true,
      },
    });

    if (!application) {
      throw new NotFoundException(JOB_APPLICATION_NOT_FOUND_MESSAGE);
    }

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
  }
}
