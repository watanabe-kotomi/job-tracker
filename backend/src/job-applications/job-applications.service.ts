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
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { validateSalaryRange } from './job-applications.validation';

@Injectable()
export class JobApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: ListJobApplicationsQueryDto,
    userId: string,
  ): Promise<PaginatedResponse<JobApplicationListItem>> {
    const { page, limit, skip } = getPagination({
      page: query.page,
      limit: query.limit,
    });

    const where = {
      userId,
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

  async findOne(id: string, userId: string): Promise<JobApplicationDetail> {
    const application = await this.prisma.jobApplication.findFirst({
      where: {
        id,
        userId,
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

  async create(
    body: CreateJobApplicationDto,
    userId: string,
  ): Promise<JobApplicationDetail> {
    const company = await this.prisma.company.findFirst({
      where: {
        id: body.companyId,
        userId,
      },
    });

    if (!company) {
      throw new NotFoundException(COMPANY_NOT_FOUND_MESSAGE);
    }

    validateSalaryRange(body.salaryMin, body.salaryMax);

    const application = await this.prisma.jobApplication.create({
      data: {
        userId,
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

  async update(
    id: string,
    body: UpdateJobApplicationDto,
    userId: string,
  ): Promise<JobApplicationDetail> {
    const existingApplication = await this.prisma.jobApplication.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        company: true,
      },
    });

    if (!existingApplication) {
      throw new NotFoundException(JOB_APPLICATION_NOT_FOUND_MESSAGE);
    }

    let targetCompanyId = existingApplication.company.id;

    if (body.companyId) {
      const company = await this.prisma.company.findFirst({
        where: {
          id: body.companyId,
          userId,
        },
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      targetCompanyId = company.id;
    }

    const nextSalaryMin =
      body.salaryMin ?? existingApplication.salaryMin ?? undefined;
    const nestSalaryMax =
      body.salaryMax ?? existingApplication.salaryMax ?? undefined;

    validateSalaryRange(nextSalaryMin, nestSalaryMax);

    const application = await this.prisma.jobApplication.update({
      where: {
        id: existingApplication.id,
      },
      data: {
        companyId: targetCompanyId,
        ...(body.positionTitle !== undefined
          ? { positionTitle: body.positionTitle }
          : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.appliedAt !== undefined
          ? { appliedAt: body.appliedAt ? new Date(body.appliedAt) : null }
          : {}),
        ...(body.source !== undefined ? { source: body.source } : {}),
        ...(body.location !== undefined ? { location: body.location } : {}),
        ...(body.salaryMin !== undefined ? { salaryMin: body.salaryMin } : {}),
        ...(body.salaryMax !== undefined ? { salaryMax: body.salaryMax } : {}),
        ...(body.jobPostUrl !== undefined
          ? { jobPostUrl: body.jobPostUrl }
          : {}),
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
      },
      include: {
        company: true,
      },
    });

    return toJobApplicationDetail(application);
  }
}
