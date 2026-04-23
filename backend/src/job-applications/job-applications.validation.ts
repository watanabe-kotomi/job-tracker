import { BadRequestException } from '@nestjs/common';

export const validateSalaryRange = (
  salaryMin?: number,
  salaryMax?: number,
): void => {
  if (
    salaryMin != undefined &&
    salaryMax != undefined &&
    salaryMin > salaryMax
  ) {
    throw new BadRequestException(
      'salaryMin must be less than or equal to salaryMax',
    );
  }
};
