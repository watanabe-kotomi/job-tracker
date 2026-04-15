import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsUrl()
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
