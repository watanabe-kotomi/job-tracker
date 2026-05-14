import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { ListCompaniesQueryDto } from './dto/list-companies-query.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  async findAll(
    @Query() query: ListCompaniesQueryDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.companiesService.findAll(query, user.userId);
  }

  @Post()
  async create(
    @Body() body: CreateCompanyDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.companiesService.create(body, user.userId);
  }
}
