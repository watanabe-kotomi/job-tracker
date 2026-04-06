import { Injectable } from '@nestjs/common';
import { ListCompaniesQueryDto } from './dto/list-companies-query.dto';
import { CompanyListItem, PaginatedResponse } from './company.type';
import { PrismaService } from 'prisma/prisma.service';
import { contains } from 'class-validator';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: ListCompaniesQueryDto,
  ): Promise<PaginatedResponse<CompanyListItem>> {
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
      ...(query.keyword
        ? {
            name: {
              contains: query.keyword,
              mode: 'insensitive' as const,
            },
          }
        : {}),
    };

    const [companies, total] = await this.prisma.$transaction([
      this.prisma.company.findMany({
        where,
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.company.count({
        where,
      }),
    ]);

    const items: CompanyListItem[] = companies.map((company) => ({
      id: company.id,
      name: company.name,
      websiteUrl: company.websiteUrl,
      country: company.country,
      notes: company.notes,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    }));

    return {
      items,
      page,
      limit,
      total,
    };
  }
}
