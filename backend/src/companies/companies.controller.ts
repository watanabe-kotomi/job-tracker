import { Controller, Get, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { ListCompaniesQueryDto } from './dto/list-companies-query.dto';

@Controller('api/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  async findAll(@Query() query: ListCompaniesQueryDto) {
    return this.companiesService.findAll(query);
  }
}
