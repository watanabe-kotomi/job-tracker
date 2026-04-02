import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ListJobApplicationsQueryDto } from './dto/list-job-applications-query.dto';

@Injectable()
export class JobApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListJobApplicationsQueryDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);

    return this.prisma.jobApplication.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
