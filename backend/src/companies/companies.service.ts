import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ListCompaniesQueryDto } from './dto/list-companies-query.dto';
import {
  CompanyDetail,
  CompanyListItem,
  PaginatedResponse,
} from './company.type';
import { PrismaService } from 'prisma/prisma.service';
import { getPagination } from '../common/utils/pagination';
import { CreateCompanyDto } from './dto/create-company.dto';
import { COMPANY_NAME_ALREADY_EXISTS_MESSAGE } from './companies.constants';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: ListCompaniesQueryDto,
  ): Promise<PaginatedResponse<CompanyListItem>> {
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
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
    }));

    return {
      items,
      page,
      limit,
      total,
    };
  }

  async create(body: CreateCompanyDto): Promise<CompanyDetail> {
    const user = await this.prisma.user.findUnique({
      where: { email: 'demo@example.com' },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingCompany = await this.prisma.company.findFirst({
      where: {
        userId: user.id,
        name: body.name,
      },
    });

    if (existingCompany) {
      throw new ConflictException(COMPANY_NAME_ALREADY_EXISTS_MESSAGE);
    }

    const company = await this.prisma.company.create({
      data: {
        userId: user.id,
        name: body.name,
        websiteUrl: body.websiteUrl ?? null,
        country: body.country ?? null,
        notes: body.notes ?? null,
      },
    });

    return {
      id: company.id,
      name: company.name,
      websiteUrl: company.websiteUrl,
      country: company.country,
      notes: company.notes,
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
    };
  }
}
