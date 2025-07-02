import { IsOptional } from 'class-validator';
import { UserEntity } from './user-entity.dto';

export class CreateLdapUserDto extends UserEntity {
  @IsOptional()
  password?: string;

  @IsOptional()
  phone?: string;
}
