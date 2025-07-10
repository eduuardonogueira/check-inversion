import { Type } from 'class-transformer';
import {
  IsString,
  IsIP,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { CreateNeighborDto } from 'src/modules/neighbors/dtos/create-neighbor.dto';

export class CreateHostDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  hostname: string;

  @IsIP('4')
  ip: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateNeighborDto)
  neighbors?: CreateNeighborDto[];
}
