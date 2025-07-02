import { Transform } from '@nestjs/class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class HostsPaginationDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  currentPage: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  pageSize: number;
}
