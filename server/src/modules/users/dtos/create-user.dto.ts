import { IsNotEmpty } from 'class-validator';
import { UserEntity } from './user-entity.dto';

export class CreateUserDto extends UserEntity {
  @IsNotEmpty()
  password: string;
}
