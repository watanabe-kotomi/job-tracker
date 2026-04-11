import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ListJobApplicationsQueryDto } from './dto/list-job-applications-query.dto';
import {
  JobApplicationDetail,
  JobApplicationListItem,
  PaginatedResponse,
} from './job-application.types';
import {
  COMPANY_NOT_FOUND_MESSAGE,
  JOB_APPLICATION_NOT_FOUND_MESSAGE,
} from './job-applications.constants';
import { getPagination } from '../common/utils/pagination';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { toJobApplicationDetail } from './job-applications.mapper';

@Injectable()
export class JobApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: ListJobApplicationsQueryDto,
  ): Promise<PaginatedResponse<JobApplicationListItem>> {
    const { page, limit, skip } = getPagination({
      page: query.page,
      limit: query.limit,
    });

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

    return toJobApplicationDetail(application);
  }

  async create(body: CreateJobApplicationDto): Promise<JobApplicationDetail> {
    const user = await this.prisma.user.findUnique({
      where: { email: 'demo@example.com' },
    });

    if (!user) {
      throw new NotFoundException(JOB_APPLICATION_NOT_FOUND_MESSAGE);
    }

    const company = await this.prisma.company.findFirst({
      where: {
        id: body.companyId,
        userId: user.id,
      },
    });

    if (!company) {
      throw new NotFoundException(COMPANY_NOT_FOUND_MESSAGE);
    }

    if (
      body.salaryMin !== undefined &&
      body.salaryMax !== undefined &&
      body.salaryMin > body.salaryMax
    ) {
      throw new BadRequestException(
        'salaryMin must be less than or equal to salaryMax',
      );
    }

    const application = await this.prisma.jobApplication.create({
      data: {
        userId: user.id,
        companyId: body.companyId,
        positionTitle: body.positionTitle,
        status: body.status,
      },
      include: {
        company: true,
      },
    });

    return toJobApplicationDetail(application);
  }
}
