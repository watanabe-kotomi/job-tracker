import { Injectable } from '@nestjs/common';
import { ListCompaniesQueryDto } from './dto/list-companies-query.dto';
import { CompanyListItem, PaginatedResponse } from './company.type';

@Injectable()
export class CompaniesService {
  async findAll(
    query: ListCompaniesQueryDto,
  ): Promise<PaginatedResponse<CompanyListItem>> {
    const items: CompanyListItem[] = [
      {
        id: 'sample-company-id',
        name: 'Rakuten',
        websiteUrl: 'http://corp.rakuten.com',
        country: 'Japan',
        notes: 'Large Japanese company',
        createdAt: new Date(),
        updatedAt: new Date(),
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
