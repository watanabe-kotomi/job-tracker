import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { ListCompaniesQueryDto } from './dto/list-companies-query.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  async findAll(@Query() query: ListCompaniesQueryDto) {
    return this.companiesService.findAll(query);
  }

  @Post()
  async create(@Body() body: CreateCompanyDto) {
    return this.companiesService.create(body);
  }
}
