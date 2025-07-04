import { IsOptional } from 'class-validator';
import { UserEntity } from '../entities/user.entity';
export class CreateLdapUserDto extends UserEntity {
  @IsOptional()
  password?: string;

  @IsOptional()
  phone?: string;
}
