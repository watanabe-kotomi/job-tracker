import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';
import { JOB_APPLICATION_STATUSES } from '../job-application-status';

export class CreateJobApplicationDto {
  @IsString()
  companyId!: string;

  @IsString()
  @MaxLength(225)
  positionTitle!: string;

  @IsIn(JOB_APPLICATION_STATUSES)
  status!: string;

  @IsOptional()
  @IsDateString()
  appliedAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  source?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMax?: number;

  @IsOptional()
  @IsUrl()
  jobPostUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
