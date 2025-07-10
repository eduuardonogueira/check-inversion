import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class HostsPaginationDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  currentPage: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  pageSize: number = 10;
}
