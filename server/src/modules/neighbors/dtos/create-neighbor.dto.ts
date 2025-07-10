import { IsString, MaxLength, Length } from 'class-validator';

export class CreateNeighborDto {
  @MaxLength(50)
  @IsString()
  hostname: string;

  @MaxLength(2)
  @IsString()
  port: string;

  @Length(3, 5)
  @IsString()
  remotePort: string;
}
