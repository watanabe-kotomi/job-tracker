import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JobApplicationsService } from './job-applications.service';
import { ListJobApplicationsQueryDto } from './dto/list-job-applications-query.dto';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/job-applications')
export class JobApplicationsController {
  constructor(
    private readonly jobApplicationsService: JobApplicationsService,
  ) {}

  @Get()
  async findAll(
    @Query() query: ListJobApplicationsQueryDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.jobApplicationsService.findAll(query, user.userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.jobApplicationsService.findOne(id, user.userId);
  }

  @Post()
  async create(
    @Body() body: CreateJobApplicationDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.jobApplicationsService.create(body, user.userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateJobApplicationDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.jobApplicationsService.update(id, body, user.userId);
  }
}
