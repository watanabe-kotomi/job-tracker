import { Controller, Get, Param, Query } from '@nestjs/common';
import { JobApplicationsService } from './job-applications.service';
import { ListJobApplicationsQueryDto } from './dto/list-job-applications-query.dto';

@Controller('api/job-applications')
export class JobApplicationsController {
  constructor(
    private readonly jobApplicationsService: JobApplicationsService,
  ) {}

  @Get()
  async findAll(@Query() query: ListJobApplicationsQueryDto) {
    return this.jobApplicationsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.jobApplicationsService.findOne(id);
  }
}
