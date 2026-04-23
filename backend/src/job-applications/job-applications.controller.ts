import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { JobApplicationsService } from './job-applications.service';
import { ListJobApplicationsQueryDto } from './dto/list-job-applications-query.dto';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';

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

  @Post()
  async create(@Body() body: CreateJobApplicationDto) {
    return this.jobApplicationsService.create(body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateJobApplicationDto) {
    return this.jobApplicationsService.update(id, body);
  }
}
